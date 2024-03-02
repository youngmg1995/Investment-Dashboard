import * as React from 'react';
import Typography, { TypographyProps } from '@mui/material/Typography';
import Link from '@mui/material/Link';

interface CopyrightProps extends TypographyProps {}

const Copyright: React.FC<CopyrightProps> = (props) => {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

export default Copyright;