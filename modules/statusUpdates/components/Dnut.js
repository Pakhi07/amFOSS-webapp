import Doughnut from "react-chartjs-2";
import PropTypes from 'prop-types';

const reactDoughnutdata = [
  {
    label: "NDC",
    value: 25,
    color: "#00E396"
  },
  {
    label: "RDC",
    value: 65,
    color: "#FEB019"
  },
  {
    label: "STOCKIST",
    value: 100,
    color: "#FF4560"
  },
  {
    label: "HOSPITAL",
    value: 15,
    color: "#775DD0"
  }
];
const reactDoughnutBackgroundColor = [
  "#00E396",
  "#FEB019",
  "#FF4560",
  "#775DD0"
];
const reactDoughnutInnerRadius = 0.5;
const reactDoughnutSelectedOffset = 0.04;
const reactDoughnutHandleClick = (item, toggled) => {
  if (toggled) {
    console.log(item);
  }
};
let reactDoughnutStrokeColor = "#FFFFFF";
const reactDoughnutOnMouseEnter = (item) => {
  let color = reactDoughnutdata.find((q) => q.label === item.label).color;
  reactDoughnutStrokeColor = color;
};

const Dnut=({ isLoaded, dailyLogData })=>{
    const a=[];
    dailyLogData.map((item) => {
        a.push(item.status);
    });
    return (
        <div className="Dnut">
            {isLoaded ? 
          <Doughnut
            width={500}
            onMouseEnter={(item) => reactDoughnutOnMouseEnter(item)}
            strokeColor={reactDoughnutStrokeColor}
            data={reactDoughnutdata}
            colors={reactDoughnutBackgroundColor}
            innerRadius={reactDoughnutInnerRadius}
            selectedOffset={reactDoughnutSelectedOffset}
            onClick={(item, toggled) => reactDoughnutHandleClick(item, toggled)}
          /> : null}
        </div>
      );
    }
    
Dnut.propTypes = {
    isLoaded: PropTypes.bool,
    dailyLogData: PropTypes.array,
};

export default Dnut; 
  