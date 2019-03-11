import { Pipe, PipeTransform } from '@angular/core';

import * as moment from 'moment';
import * as _ from 'lodash';


@Pipe({
  name: 'lastMsgTime',
})
export class LastMsgTimePipe implements PipeTransform {
  transform(value, ...args) {
    var msgTime = moment(value);
    var currentTime = moment();

    var duration = moment.duration(currentTime.diff(msgTime));
    var seconds = duration.asSeconds();
    var minutes = duration.asMinutes();
    var hours = duration.asHours();
    var days = duration.asDays();

    var modifiedTime: any;
    /* console.log('Time Duration:');
    console.log('seconds ', seconds);
    console.log('minutes ', minutes);
    console.log('hours ', hours);
    console.log('days ', days); */
    
    switch (true) {
      case days >= 1 && days < 2:
        modifiedTime = _.round(days) + ' day ago';
        // console.log('Modified Time 1', modifiedTime);

        break;

      case days > 2:
        modifiedTime = _.round(days) + ' days ago';
        // console.log('Modified Time 1', modifiedTime);
        
        break;
      
      case hours >= 1 && hours < 24:
        modifiedTime = _.round(hours) + 'h ago';
        // console.log('Modified Time 2', modifiedTime);
        
        break;

      case minutes >= 1 && minutes < 60:
        modifiedTime = _.round(minutes) + 'm ago';
        // console.log('Modified Time 3', modifiedTime);
        
        break;

      case seconds <= 60:
        modifiedTime = _.round(seconds) + 's ago';
        // console.log('Modified Time 4', modifiedTime);
        
        break;
      default:
        break;
    }
    return modifiedTime;
  }
}
