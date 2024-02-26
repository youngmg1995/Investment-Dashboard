import * as React from 'react';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { Tooltip } from '@mui/material';

interface SummaryKpiProps {
  value: number,
  investedFunds: number,
  returns: number,
  avgApr: number,
}

const SummaryKpi: React.FC<SummaryKpiProps> = (props) => {
  return (
    <React.Fragment>
      <Typography component="p" variant="h3">
        {formatNumber(props.value)}
      </Typography>
      <Stack direction="row" spacing={1}>
        <Tooltip title="Invested Funds">
          <Chip label={formatNumber(props.investedFunds)} variant="outlined"/>
        </Tooltip>
        <Tooltip title="Total Returns">
          <Chip label={formatNumber(props.returns)} variant="outlined"/>
        </Tooltip>
        <Tooltip title="Avg. APR">
          <Chip label={formatPercent(props.avgApr)} variant="outlined"/>
        </Tooltip>
      </Stack>
    </React.Fragment>
  );
}

export default SummaryKpi;


function formatNumber(n: number): string {
  return "$" + n.toFixed(2);
}

function formatPercent(p: number): string {
  return (p*100).toFixed(2) + "%";
}

function formatSubMetrics(metrics: SummaryKpiProps): string {
  const funds = formatNumber(metrics.investedFunds);
  const returns = formatNumber(metrics.returns);
  const apr = formatPercent(metrics.avgApr);
  return `${funds} ${returns} ${apr}`;
}