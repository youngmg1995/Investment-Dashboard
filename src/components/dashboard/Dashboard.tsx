import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Chart from './Chart';
import Orders from './Orders';

import Portfolio from '../../portfolio';
import AppBar from './AppBar';
import Copyright from './Copyright';
import { PieChart, PieDatum } from '../charts';
import SummaryKpi from './SummaryKpi';

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

interface DashboardProps {
  portfolio: Portfolio,
}

const Dashboard: React.FC<DashboardProps> = (props) => {

  let mixChartData: PieDatum[] = [];
  const holdings = props.portfolio.getHoldings()
  for (let s in holdings) {
    const h = holdings[s];
    mixChartData.push({
      key: s,
      value: h.value(),
    })
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        {/* App Toolbar */}
        <AppBar />
        {/* Dashboard Content */}
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Toolbar /> {/* Spacer for Appbar */}
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
              {/* Summary KPI */}
              <Grid item xs={12} md={4} lg={3}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 240,
                  }}
                >
                  <SummaryKpi
                    value={12345} investedFunds={10000} returns={2345} avgApr={.126573564}
                  />
                </Paper>
              </Grid>
              {/* Chart */}
              <Grid item xs={12} md={8} lg={9}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 240,
                  }}
                >
                  <PieChart data={mixChartData} width={200} height={200}/>
                </Paper>
              </Grid>
              {/* Chart */}
              <Grid item xs={12} md={8} lg={9}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 240,
                  }}
                >
                  <Chart />
                </Paper>
              </Grid>
              {/* Recent Orders */}
              <Grid item xs={12}>
                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                  <Orders />
                </Paper>
              </Grid>
            </Grid>
            <Copyright sx={{ pt: 4 }} />
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default Dashboard;