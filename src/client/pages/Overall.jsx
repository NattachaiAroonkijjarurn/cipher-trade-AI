// React
import React from 'react';
import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";

// DropDown
import "../layouts/layoutsCss/DropDown.css"

// DatePicker
import { DateRangePicker } from 'react-date-range';
import { subDays, set } from 'date-fns';
import moment from 'moment'; // for change the format of date
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { BsCalendar2DateFill } from "react-icons/bs"; // calender icon

// Chart
import Chart from 'chart.js/auto';
import 'chartjs-plugin-datalabels';
import 'chartjs-adapter-moment';

// Normal CSS
import './css/Overall.css'

const Overall = () => {
  return <h1>Overall</h1>;
};

export default Overall;