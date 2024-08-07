import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import { Link, useLocation } from "react-router-dom";
import Typography from "@mui/material/Typography";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Collapse from "@mui/material/Collapse";
import { useToken } from "../TokenContext"; // Import the useToken hook
import CameraAltIcon from "@mui/icons-material/CameraAlt";

export default function NavBar(props) {
  const { drawerWidth, content } = props;
  const location = useLocation();
  const path = location.pathname;
  const [open, setOpen] = React.useState(false);
  const { token, userData } = useToken(); // Get the token and userData from context
  const { cameraData } = useToken();
  const cameras = cameraData.cameras || []; // Access cameras from userData

  const handleClick = () => {
    setOpen(!open);
  };

  const getListItemProps = (route) => {
    return {
      component: Link,
      to: route,
      selected: path === route,
      sx: {
        backgroundColor: path === route ? "rgba(0, 0, 0, 0.08)" : "inherit",
      },
    };
  };

  const renderCameraList = () => {
    return cameras.map((camera, index) => (
      <ListItem key={index} disablePadding>
        <ListItemButton
          {...getListItemProps(`/dashboard/cameras/${camera.id}`)}
        >
          <ListItemText primary={camera.name || `Camera ${index + 1}`} />
        </ListItemButton>
      </ListItem>
    ));
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Hi {userData.firstName}
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <List>
            <ListItem disablePadding>
              <ListItemButton                
                onClick={handleClick}
              >
                <ListItemIcon>
                  <CameraAltIcon />
                </ListItemIcon>
                <ListItemText primary={"Cameras"} />
                {open ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
            </ListItem>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {renderCameraList()}
              </List>
            </Collapse>
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />

        {content}
      </Box>
    </Box>
  );
}
