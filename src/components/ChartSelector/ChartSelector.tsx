import React from 'react';
import { Theme, useTheme } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Chip from '@material-ui/core/Chip';
import { Paper } from '@material-ui/core';
import useStyles, { MenuProps } from './ChartSelector.styles';

export default function ChartSelector(props: {
  names: string[], setCharts:(state:string[] | [])=>void, charts: string[] }) {
  const { names = [], setCharts, charts = [] } = props;
  const classes = useStyles();
  const theme = useTheme();

  // const [charts, setCharts] = React.useState<string[]>([]);

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setCharts(event.target.value as string[]);
    // if (change) change(charts);
  };

  function getStyles(name: string, _personName: string[], _theme: Theme) {
    return {
      fontWeight:
        _personName.indexOf(name) === -1
          ? _theme.typography.fontWeightRegular : _theme.typography.fontWeightMedium,
    };
  }

  return (
    <FormControl className={classes.formControl}>
      <Paper component="ul" className={classes.paperList}>
        {charts.map((data) => {
          let icon;

          return (
            <li key={data}>
              <Chip
                icon={icon}
                label={data}
                onDelete={() => {
                  setCharts(charts.filter((person) => person !== data));
                }}
                className={classes.chip}
              />
            </li>
          );
        })}
      </Paper>
      <Select
        labelId="demo-mutiple-chip-label"
        id="demo-mutiple-chip"
        multiple
        value={charts}
        onChange={handleChange}
        input={<Input id="select-multiple-chip" />}
        MenuProps={MenuProps}
        displayEmpty
        renderValue={() => <p>Select chart</p>}
      >
        {names.map((name) => (
          <MenuItem key={name} value={name} style={getStyles(name, charts, theme)}>
            {name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
