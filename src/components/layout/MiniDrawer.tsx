import { Activity, useState } from "react";
import {
  Drawer,
  Toolbar,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Box,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import BuildIcon from "@mui/icons-material/Build";
import SettingsIcon from "@mui/icons-material/Settings";
import { Link, useLocation } from "react-router-dom";
import { styled } from "@mui/styles";
import StitchLogo from "../../assets/images/stitch-icon-transparent-bg.webp";

const drawerWidth = 240;
const miniWidth = 64;

const LogoContainer = styled("div")({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "12px 8px 20px 8px",
});

export default function MiniDrawer() {
  const [open, setOpen] = useState<boolean>(true);
  const location = useLocation();

  const navItems = [
    // { label: "Builder", icon: <BuildIcon />, to: "/workflows" },
    { label: "Config", icon: <SettingsIcon />, to: "/workflows/config" },
    { label: "Run", icon: <SettingsIcon />, to: "/workflows/run" },
  ];

  return (
    <Drawer
      variant="permanent"
      open={open}
      sx={{
        width: open ? drawerWidth : miniWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: open ? drawerWidth : miniWidth,
          boxSizing: "border-box",
          borderRight: "1px solid var(--glass-border)",
          backgroundColor: "var(--glass-bg)",
          backdropFilter: "blur(10px)",
        },
      }}
    >
      <Toolbar sx={{ justifyContent: open ? "flex-end" : "center" }}>
        <Activity mode={open ? "visible" : "hidden"}>
          <LogoContainer>
            <img
              src={StitchLogo}
              alt="Stitch Logo"
              width="98px"
              height="18px"
              style={{ marginTop: "8px" }}
            />
          </LogoContainer>
        </Activity>
        <IconButton
          onClick={() => setOpen(!open)}
          size="small"
          sx={{ color: "var(--text-primary)" }}
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>
      <Divider />
      <List>
        {navItems.map((item) => {
          const selected = location.pathname === item.to;
          return (
            <ListItemButton
              key={item.to}
              component={Link}
              to={item.to}
              selected={selected}
              sx={{
                px: open ? 2 : 1,
                justifyContent: open ? "flex-start" : "center",
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 1.5 : 0,
                  color: "var(--text-primary)",
                }}
              >
                {item.icon}
              </ListItemIcon>
              {open && (
                <ListItemText
                  primary={item.label}
                  sx={{ color: "var(--text-primary)" }}
                />
              )}
            </ListItemButton>
          );
        })}
      </List>
      <Box sx={{ flex: 1 }} />
      <Activity mode={open ? "visible" : "hidden"}>
        <LogoContainer>
          <img src={StitchLogo} alt="Stitch Logo" width="98px" height="18px" />
        </LogoContainer>
      </Activity>
    </Drawer>
  );
}
