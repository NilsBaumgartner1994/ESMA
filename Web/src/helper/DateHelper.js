import React, { Component } from "react";

export class DateHelper extends Component {

    static getDateDifferenceInMinutes(start,end){
        if(start != null && end != null){
            let diffMilliseconds = end-start;
            let diffSeconds = diffMilliseconds/1000;
            let diffMinutes = diffSeconds/60;
            return diffMinutes;
        } else {
            return null;
        }
    }

    /**
     * Adds leading Zeros
     * @param num
     * @param size
     * @returns {string}
     */
    static pad(num, size) {
        var s = num + "";
        while (s.length < size) s = "0" + s;
        return s;
    }

    static getWeekdaynameByNumber(weekdayNumber){
        //weekdaynumber sunday = 0
        weekdayNumber = weekdayNumber%7+1; //sunday will now be 1
        let februar = 1;
        //1970-feb-1 was a sunday
        let date = new Date(1970, februar, weekdayNumber);
        return DateHelper.getWeekdaynameByDate(date);
    }

    static getWeekdaynameByDate(date){
        return date.toLocaleDateString("default", { weekday: 'long' });
    }

    static getMonthnameByNumber(monthNumber) {
            let date = new Date(1970, monthNumber, 1);
            return DateHelper.getMonthnameByDate(date);
    }

    static getMonthnameByDate(date) {
        let monthName = date.toLocaleString("default", { month: "long" });
        return monthName;
    }

}
