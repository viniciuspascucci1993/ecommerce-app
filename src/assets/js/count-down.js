'use strict';
function Util() {}
Util.setAttributes = function (el, attrs) {
    for (var key in attrs) {
        el.setAttribute(key, attrs[key]);
    }
};

(function () {
    var CountDown = function (element) {
        this.element = element;
        this.labels = this.element.getAttribute('data-labels') ? this.element.getAttribute('data-labels').split(',') : [];
        this.intervalId;
        // set visible labels
        this.setVisibleLabels();
        //create countdown HTML
        this.createCountDown();
        //store time elements
        this.days = this.element.getElementsByClassName('js-countdown__value--0')[0];
        this.hours = this.element.getElementsByClassName('js-countdown__value--1')[0];
        this.mins = this.element.getElementsByClassName('js-countdown__value--2')[0];
        this.secs = this.element.getElementsByClassName('js-countdown__value--3')[0];
        this.endTime = this.getEndTime();
        //init counter
        this.initCountDown();
    };

    CountDown.prototype.setVisibleLabels = function () {
        this.visibleLabels = this.element.getAttribute('data-visible-labels') ? this.element.getAttribute('data-visible-labels').split(',') : [];
        this.visibleLabels = this.visibleLabels.map(function (label) {
            return label.trim();
        });
    };

    CountDown.prototype.createCountDown = function () {
        var wrapper = document.createElement("div");
        Util.setAttributes(wrapper, {'aria-hidden': 'true', 'class': 'countdown__timer'});

        for (var i = 0; i < 4; i++) {
            var timeItem = document.createElement("span"),
                timeValue = document.createElement("span"),
                timeLabel = document.createElement('span');

            timeItem.setAttribute('class', 'countdown__item');
            timeValue.setAttribute('class', 'countdown__value countdown__value--' + i + ' js-countdown__value--' + i);
            timeItem.appendChild(timeValue);

            if (this.labels && this.labels.length > 0) {
                timeLabel.textContent = this.labels[i].trim();
                timeLabel.setAttribute('class', 'countdown__label');
                timeItem.appendChild(timeLabel);
            }

            wrapper.appendChild(timeItem);
        }
        // append new content to countdown element
        this.element.insertBefore(wrapper, this.element.firstChild);
    };

    CountDown.prototype.getEndTime = function () {
        // get number of remaining seconds
        if (this.element.getAttribute('data-timer')) {
            return Number(this.element.getAttribute('data-timer')) * 1000 + Date.now();
        } else if (this.element.getAttribute('data-countdown')) {
            return new Date(this.element.getAttribute('data-countdown')).getTime();
        }
    };

    CountDown.prototype.initCountDown = function () {
        var self = this;
        this.intervalId = setInterval(function () {
            self.updateCountDown(false);
        }, 1000);
        this.updateCountDown(true);
    };

    CountDown.prototype.updateCountDown = function (bool) {
        var time = Math.floor((this.endTime - Date.now()) / 1000);
        var days = 0, hours = 0, mins = 0, seconds = 0;

        if (time <= 0) {
            clearInterval(this.intervalId);
            this.emitEndEvent();
        } else {
            days = Math.floor(time / 86400);
            time %= 86400;
            hours = Math.floor(time / 3600);
            time %= 3600;
            mins = Math.floor(time / 60);
            seconds = time % 60;
        }

        // hide days/hours/mins if not available
        if (bool && days === 0 && this.visibleLabels.indexOf('d') < 0) this.days.parentElement.style.display = "none";
        if (bool && days === 0 && hours === 0 && this.visibleLabels.indexOf('h') < 0) this.hours.parentElement.style.display = "none";
        if (bool && days === 0 && hours === 0 && mins === 0 && this.visibleLabels.indexOf('m') < 0) this.mins.parentElement.style.display = "none";

        this.days.textContent = days;
        this.hours.textContent = this.getTimeFormat(hours) + ' ';
        this.mins.textContent = this.getTimeFormat(mins) + ' ';
        this.secs.textContent = this.getTimeFormat(seconds);
    };

    CountDown.prototype.getTimeFormat = function (time) {
        return (' 0' + time).slice(-2);
    };

    CountDown.prototype.emitEndEvent = function () {
        var event = new CustomEvent('countDownFinished');
        this.element.dispatchEvent(event);
    };

    // Functions calling
    window.addEventListener('load', function () {
        var countDownElements = document.getElementsByClassName('js-countdown');
        if (countDownElements.length > 0) {
            for (var i = 0; i < countDownElements.length; i++) {
                new CountDown(countDownElements[i]);
            }
        }
    });
}());
