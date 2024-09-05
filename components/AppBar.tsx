import React from "react";
import { AppBar, Toolbar, Tabs, Tab } from "@mui/material";
import { useRouter } from "next/navigation";

const AppNavbar: React.FC<{ tabValue: number }> = ({ tabValue }) => {
  const router = useRouter();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    if (newValue === 0) {
      router.push("/");
    } else if (newValue === 1) {
      router.push("/create-event");
    }
  };

  return (
    <AppBar position="static">
      <Toolbar sx={{ justifyContent: 'center' }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          textColor="inherit"
          TabIndicatorProps={{
            style: { backgroundColor: 'white' },
          }}
          sx={{
            '& .MuiTab-root': {
              color: 'white',
            },
        }}>
          <Tab label="Events" />
          <Tab label="Create" />
        </Tabs>
      </Toolbar>
    </AppBar>
  );
};

export default AppNavbar;