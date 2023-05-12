import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
ChartJS.register(
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);
import { CloseOutlined, DragOutlined } from "@ant-design/icons";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "../../../styles/widgets/lineChart.module.css";
import { Rnd } from "react-rnd";
import { useState } from "react";
import { generateKey } from "crypto";
import { generateQuery } from "../../../utils/queryKing";
import { generateTimePeriods } from '../../../utils/generateTimePeriods';
import { Alex_Brush } from "next/font/google";

interface Props {
  showWidget: () => void;
}

const LineChart = ({ showWidget }: Props) => {
  const dispatch = useDispatch();
  const [size, setSize] = useState({ width: 300, height: 300 });
  const [position, setPosition] = useState({ x: 10, y: 10 });

  const handleClose = () => {
    showWidget();
  };
  const labels = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    'August',
    'September',
    'October',
    'November',
    'December'
  ];

  const queriesInfo = useSelector((state) => { return state.lineChart });


  console.log('Queries info:', queriesInfo);

  let requests = [];
  let { startDates, endDates } = generateTimePeriods({
    start: queriesInfo.period.start,
    end: queriesInfo.period.end,
    unit: queriesInfo.axes.x[1]
  });
  if (queriesInfo.axes.y[1] === 'acrossLocations') {
    for (let i = 0; i < startDates.length; i++) {
      requests.push({
        label: 'Total',
        query: generateQuery(queriesInfo.filters, [startDates[i], endDates[i], 'aggregate'])
      });
    }

  } else if (queriesInfo.axes.y[1] === 'inSpecificLocations') {


  } else if (queriesInfo.axes.y[1] === 'inEachLocation') {
    for (let i = 0; i < startDates.length; i++) {
      requests.push({
        label: 'Total',
        query: generateQuery(queriesInfo.filters, [startDates[i], endDates[i], 'aggregate'])
      });
    }
  }
  console.log(requests);



  // Each locationRequest represents either total sales, or sales in a particular location
  // Aim to convert these, through use of fetch requests, into objects as per below
  // Each fetch request will provide one number for the data


  const data = {
    labels: labels.slice(0, 7),
    datasets: [
      {
        label: "Dataset 1",
        data: ["40", "34", "15", "27", "126", "89"],
        fill: false,
        borderColor: "#002642",
        backgroundColor: "#002642",
      },
      {
        label: "Dataset 2",
        data: ["78", "54", "2", "206", "26", "15"],
        fill: true,
        borderColor: "#840032",
        backgroundColor: "#840032",
      },
      {
        label: "Dataset 3",
        data: ["50", "48", "46", "40", "45", "42"],
        fill: true,
        borderColor: "#538927",
        backgroundColor: "#538927",
      },
    ],
  };
  useEffect(() => {
    dispatch({
      type: "FETCH_DATA"
    })
  }, [])

  const onDragStop = (e, d) => {
    setPosition({ x: d.x, y: d.y });
  };

  const onResizeStop = (e, direction, ref, delta, position) => {
    setSize({
      width: parseInt(ref.style.width),
      height: parseInt(ref.style.height),
    });
    setPosition(position);
    console.log(size);
  };

  return (
    <Rnd
      size={size}
      position={position}
      onDragStop={onDragStop}
      onResizeStop={onResizeStop}
      dragGrid={[30, 30]}
      resizeGrid={[30, 30]}
      bounds="parent"
      minWidth={500}
      minHeight={300}
    >
      <div className={styles.chart}>
        <div className={styles.icons}>
          <DragOutlined />
          <CloseOutlined onClick={handleClose} />
        </div>
        <Line data={data} />
      </div>
    </Rnd>
  );
};

export default LineChart;
