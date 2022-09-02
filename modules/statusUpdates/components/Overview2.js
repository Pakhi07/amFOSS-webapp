import React, { useEffect, useState } from 'react';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import Card from 'antd/lib/card';
// antd components
import DatePicker from 'antd/lib/date-picker';
import Cookies from 'universal-cookie';

import dataFetch from '../../../utils/dataFetch';
import Statsdash from './Statsdash';
import Doughnut from './Doughnut';

const { RangePicker } = DatePicker;
const moment = extendMoment(Moment);
const cookies = new Cookies();

const Overview2 = () => {
  const usernamecookie=cookies.get('username');
  const [data, setData] = useState([]);
  const [dailyLogData, setDailyLogData] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [pieData, setPieData] = useState([]);
  var numberDays=7;

  const [userName,setUserName] = useState([]);
  const [days,setDays] = useState(numberDays);
  const [given,setGiven] = useState(0);
  const [notGiven,setNotGiven] = useState(0);

  const [rangeLoaded, setRangeLoaded] = useState(false);
  const [isLoaded, setLoaded] = useState(false);

  const query = `query ($startDate: Date!, $endDate: Date){
  clubStatusUpdate(startDate: $startDate, endDate: $endDate){
    dailyLog{
      date
      membersSentCount
    }
    memberStats{
      user{
        username
        admissionYear
      }
      statusCount
    }
  }
}`;


  const fetchData = async (variables) => dataFetch({ query, variables });

  useEffect(() => {
    if (!rangeLoaded) {
      setStartDate(new Date(moment().subtract(1, 'weeks').format('YYYY-MM-DD')));
      setRangeLoaded(true);
      numberDays=7;
    }
    
      // console.log(moment(endDate).diff(moment(startDate), 'days'));
    if (!isLoaded && rangeLoaded) {
      const variables = {
        startDate: moment(startDate).format('YYYY-MM-DD'),
        endDate: moment(endDate).format('YYYY-MM-DD'),
      };
      
      fetchData(variables).then((r) => {
        // setUserName(r.data.clubStatusUpdate.memberStats.usernamecookie);
        r.data.clubStatusUpdate.memberStats.map((item)=> {
          if(item.user.username === usernamecookie) {
            var start = moment(startDate);
            var end = moment(endDate);
            const arr=[['status', 'count'],
            ['Updates given'],
            ['Not given'],];
            numberDays=moment(end).diff(moment(start), 'days');
            setDays(numberDays);
            arr[1].push(parseInt(item.statusCount));
            setGiven(item.statusCount);
            arr[2].push(numberDays-item.statusCount);
            setNotGiven(numberDays-item.statusCount);
            setPieData(arr);
            // console.log(arr);
            // console.log(item.statusCount);
          }
        });

        

        
        setData(r.data.clubStatusUpdate.memberStats);
        setDailyLogData(r.data.clubStatusUpdate.dailyLog);
        setLoaded(true);
      });
    }
  });

  

  const handleRangeChange = (obj) => {
    if (obj[0] != null && obj[1] != null) {
      setStartDate(moment(obj[0]));
      setEndDate(moment(obj[1]));   
      setLoaded(false);
      numberDays=moment(endDate).diff(moment(startDate), 'days');

    }
    // console.log(numberDays);

  };


  return (
    <div className="p-4">
      <div className="mx-2">
        <div className="row m-0">
          <div className="col text-right">
            <RangePicker
              defaultValue={[
                moment(new Date(), 'YYYY-MM-DD').subtract(1, 'weeks'),
                moment(new Date(), 'YYYY-MM-DD'),
              ]}
              onChange={handleRangeChange}
            />
          </div>
        </div>
      </div>
      <div className="row m-0">   
          <div class="flex-container"
               style={{ display:'flex' }}>
               <div class="flex-child magenta"
                    style={{ flex:1}}>
                    <div style={{ width:'509px',marginLeft: '28px',marginRight:'30px', boxShadow: '10px 10px 5px rgba(0, 0, 0, 0.25)'}}>
                      <Card>
                      <div class="flex-container"
                           style={{ display:'flex', flexBasis: 0 }}>
                          <div class="flex-child yellow"
                             style={{ flex:1, textAlign:'center'}}>
                              <h3>{days}</h3>
                              <h7>Total number of days</h7>
                          </div>
                          <div class="flex-child red"
                             style={{ flex:1, textAlign:'center'}}>
                              <h3>{given}</h3>
                              <h7>Updates given</h7>
                          </div>
                          <div class="flex-child blue"
                             style={{ flex:1, textAlign:'center'}}>
                              <h3>{notGiven}</h3>
                              <h7>Updates missed</h7>
                          </div>
                      </div>
                      </Card>
                    </div>
                    <div style={{ width:'509px', marginLeft: '28px', marginTop: '20px', marginRight:'10px', boxShadow: '10px 10px 5px rgba(0, 0, 0, 0.25)'}}>
                        <Card>
                          <div><p>Number of times updated first:👍</p></div>
                          <div><p>Number of times updated last:🐌</p></div>
                          <div><p>Number of times got kicked:☠</p></div>
                        </Card>
                    </div>
                </div>
        
                <div class="flex-child green"
                     style={{ flex:1,}}>
                     <div className="col-18 p-2"
                          style={{backgroundColor: '#FFFFFF', boxShadow: '10px 10px 5px rgba(0, 0, 0, 0.25)'}}>
                           <Doughnut pdata={pieData}/>
                    </div>
                </div>
          </div>

          <div className="col-md p-2"
               style={{backgroundColor: '#FFFFFF', margin: '28px', boxShadow: '10px 10px 5px rgba(0, 0, 0, 0.25)'}}>
                  <Statsdash data={data} isLoaded={true} />
          </div>
      </div>
    </div>
  );
};

export default Overview2;
