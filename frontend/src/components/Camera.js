import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AxiosInstance from "./Axios";
import { useToken } from "../TokenContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Table, Button } from "antd";
import "./Camera.css";
import { startOfToday } from "date-fns";
import Hls from "hls.js";
const Camera = () => {
  const { id } = useParams();
  const { token } = useToken();
  const [camera, setCamera] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [setRecordingError] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [segments, setSegments] = useState([]);
  const { saveCameraData, cameraData } = useToken();
  const today = startOfToday();
  const [streamUrl, setStreamUrl] = useState(null);
  const [isPlayingRecording, setIsPlayingRecording] = useState(false);
  const [fetchingData, setfetchingData] = useState(false);

  useEffect(() => {
    if (isPlayingRecording === true) {
      return;
    }
    setStreamUrl("");
    setIsPlayingRecording(false);
    const fetchData = async () => {
      try {
        const cameras = await AxiosInstance.post("cameras/", {
          token,
        });
        saveCameraData({
          totalCamerasCount: cameras.data.results.length,
          cameras: cameras.data.results,
        });
        const foundCamera = cameraData.cameras.find(
          (cam) => cam.id === parseInt(id)
        );

        if (foundCamera) {
          setCamera(foundCamera);
          setLoading(false);
        } else {
          setError("Camera not found");
        }
      } catch (err) {
        console.error("Error fetching initial data:", err);
        setError("Error fetching initial data");
      } finally {
      }
    };

    fetchData();

    return () => {};
  }, [id, token, isPlayingRecording]);
  const handleDateChange = async (date) => {
    setfetchingData(true);
    setStreamUrl("");
    if (date === null) {
      return;
    }
    const dateAtMidnightUTC = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0)
    );
    const nextDay = new Date(date);
    nextDay.setUTCDate(date.getUTCDate() + 2);
    const dateAtMidnightNextDayUTC = new Date(
      Date.UTC(
        nextDay.getUTCFullYear(),
        nextDay.getUTCMonth(),
        nextDay.getUTCDate(),
        0,
        0,
        0
      )
    );
    setSelectedDate(date);
    if (camera && camera.id) {
      try {
        const response = await AxiosInstance.post(`recordinglist/`, {
          token,
          cameraId: camera.id,
          start: dateAtMidnightUTC.toISOString(),
          end: dateAtMidnightNextDayUTC.toISOString(),
        });
        setSegments(response.data.segments);
        setfetchingData(false);
      } catch (err) {
        console.error("Error fetching recordings:", err);
        setRecordingError("Error fetching recordings");
      }
    }
  };
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const seconds = date.getUTCSeconds();

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };
  const handlePlay = async (start, end) => {
    const response = await AxiosInstance.post("recordStream/", {
      token,
      cameraId: id,
      start: start,
    });
    const { url } = response.data;
    setStreamUrl(url);
    setIsPlayingRecording(true);
    setTimeout(() => {
      let video = document.getElementById("recording");
      if (video) {
        const hls = new Hls();
        hls.loadSource(url);
        hls.attachMedia(video);
        video.play();
      }
    }, 1000);
  };
  const getTimestamp = (dateString) => new Date(dateString).getTime();

  const handleBackToLiveStream = async () => {
    setIsPlayingRecording(false);
    setStreamUrl(null);
  };
  const columns = [
    {
      title: "Start Time",
      dataIndex: "start",
      key: "start",
      render: (text) => formatDate(text),
      sorter: (a, b) => getTimestamp(a.start) - getTimestamp(b.start),
      defaultSortOrder: "ascend",
    },
    {
      title: "End Time",
      dataIndex: "end",
      key: "end",
      render: (text) => formatDate(text),
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Button
          onClick={() => handlePlay(record.start, record.end)}
          type="primary"
        >
          Play
        </Button>
      ),
    },
  ];
  const dataSource = segments;
  return (
    <div class="camera-div">
      {!isPlayingRecording ? (
        <div>
          <h3>Live Stream</h3>
          {camera.streams.map((stream, index) => (
            <div key={index}>
              <div>
                {stream.format === "mjpeg" && camera.streams.length === 1 ? (
                  <img
                    src={stream.url}
                    alt={`Stream ${index + 1}`}
                    style={{ maxWidth: "100%", height: "auto" }}
                  />
                ) : (
                  stream.format === "mp4" && (
                    <video autoPlay width="800px">
                      <source src={stream.url} />
                      Your browser does not support the video tag.
                    </video>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <Button
            onClick={handleBackToLiveStream}
            type="primary"
            style={{ marginBottom: "10px" }}
          >
            Back to Live Stream
          </Button>
          <h3>Recording</h3>

          <video id="recording" controls autoPlay width="800px">
            <source src={streamUrl} type="application/x-mpegURL" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}

      <p>{camera.has_recording ? "" : "No Records Found"}</p>
      {camera.has_recording && (
        <div>
          <h3>Select Date for Recordings</h3>
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            dateFormat="yyyy-MM-dd"
            isClearable
            placeholderText="Select a date"
            maxDate={today}
          />
          {selectedDate !== null &&
            (dataSource.length === 0 ? (
              fetchingData ? (
                <div>Loading...</div>
              ) : (
                <div>No records found</div>
              )
            ) : (
              <Table dataSource={dataSource} columns={columns} />
            ))}
        </div>
      )}
    </div>
  );
};

export default Camera;
