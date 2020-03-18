import moment from 'dayjs';


/**
 * 时间段过滤，以天和秒的形式返回时间段
 * 单个时间过滤，以天，小时，秒等形式，返回时间格式
 * @type {{rangeFormate: function(*, *), toDay: function(*=): (string | string[] | string), toSecond: function(*=): (string | string[] | string), switchSconds: function(*=): string, toText: function(*=): string}}
 */
export const dateFormat = {
  rangeFormate: (values, fields) => {
    const backValues = {};
    backValues[fields[0]] = moment(values[0]).format('YYYY-MM-DD');
    backValues[fields[1]] = moment(values[1]).format('YYYY-MM-DD');
    return backValues;
  },
  rangeFormateSeconds: (values, fields) => {
    const backValues = {};
    backValues[fields[0]] = moment(values[0]).format('YYYY-MM-DD HH:mm:ss');
    backValues[fields[1]] = moment(values[1]).format('YYYY-MM-DD HH:mm:ss');
    return backValues;
  },
  toDay: (values) => {
    let backValues = '';
    if (values instanceof Array) {
      backValues = [];
      backValues = values.map(ele => {
        return moment(ele).format('YYYY-MM-DD');
      });
    } else {
      backValues = moment(values).format('YYYY-MM-DD');
    }
    return backValues;
  },
  toSecond: (values) => {
    let backValues = '';
    if (values instanceof Array) {
      backValues = [];
      backValues = values.map(ele => {
        return moment(ele).format('YYYY-MM-DD HH:mm:ss');
      });
    } else {
      backValues = moment(values).format('YYYY-MM-DD HH:mm:ss');
    }
    return backValues;
  },
  switchSconds: (value) => {
    let time = parseFloat(value);
    let allStr = '';
    const minuteFormat = 60;
    const hourFormat = minuteFormat * 60;
    const dayFormat = hourFormat * 24;
    const day = parseInt(time / dayFormat);
    const strDay = day >= 10 ? day : `0${day}`;
    if (day > 0) allStr += `${strDay}天`;
    const hours = parseInt((time - day * dayFormat) / hourFormat);
    const strHours = hours >= 10 ? hours : `0${hours}`;
    if (hours > 0) allStr += `${strHours}小时`;
    const minutes = parseInt((time - day * dayFormat - hours * hourFormat) / minuteFormat);
    const strMinutes = minutes >= 10 ? minutes : `0${minutes}`;
    if (minutes > 0) allStr += `${strMinutes}分钟`;
    return allStr;
  },
  toText: (value) => {
    let backValue = moment(value).format('YYYY-MM-DD');
    backValue = backValue.replace(/-/g, '');
    return backValue;
  }
};

/**
 *
 * @param url
 * @returns {boolean}
 */
export const isVideo = (url) => {
  const reg = /\.(avi|3gp|flv|mp4|ogg)$/;
  return reg.test(url);
};

