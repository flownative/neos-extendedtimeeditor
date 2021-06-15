import React, {Component} from 'react';
// import enhanceWithClickOutside from '@neos-project/react-ui-components';
import moment, {Moment, isMoment} from 'moment-timezone';
import mergeClassNames from 'classnames';
// @ts-ignore missing typings - we can not update due to a know issue with firefox (https://github.com/neos/neos-ui/pull/1874)
import Collapse from 'react-collapse';
import DatePicker, {TimeConstraints} from 'react-datetime';
import PropTypes from 'prop-types';

// @ts-ignore
import {Button, SelectBox, Icon, DateInput, SelectBox_Option_SingleLine} from '@neos-project/react-ui-components';

import style from './style.css';

export default class ExtendedDateInput extends DateInput {
    state = {isOpen: false, transientDate: null, selectedTimezone: null}

    static defaultProps = {
        labelFormat: 'DD-MM-YYYY hh:mm z',
        timezoneSupport: false,
        timeConstraints: {
            minutes: {
                min: 0,
                max: 59,
                step: 5
            }
        },
    };

    render() {
        const {
            placeholder,
            value,
            className,
            id,
            todayLabel,
            applyLabel,
            labelFormat,
            dateOnly,
            timeOnly,
            locale,
            disabled,
            timezoneSupport,
            displayTimezone
        } = this.props;
        const incomingValueMoment = value ? moment(value) : undefined;
        const editedValue = this.state.transientDate ? this.state.transientDate : incomingValueMoment;
        const displayedDate = (editedValue && displayTimezone) ? moment(editedValue).tz(displayTimezone).format(labelFormat) : '';

        const wrapper = mergeClassNames(
            style.wrapper,
            {
                [style.disabled]: disabled,
            },
        );

        const calendarInputWrapper = mergeClassNames(className, style.calendarInputWrapper);

        const calendarFakeInputMirror = mergeClassNames(
            style.calendarFakeInputMirror,
            {
                [style['disabled-cursor']]: disabled,
            },
        );

        const calendarIconBtn = mergeClassNames(
            style.calendarIconBtn,
            {
                [style['disabled-cursor']]: disabled,
            },
        );

        const closeCalendarIconBtn = mergeClassNames(
            style.closeCalendarIconBtn,
            {
                [style['disabled-cursor']]: disabled,
            },
        );

        return (
            <div className={wrapper}>
                <div className={calendarInputWrapper}>
                    <button
                        onClick={this.handleClick}
                        className={calendarIconBtn}
                    >
                        <Icon icon="far calendar-alt"/>
                    </button>
                    <div className={style.calendarFakeInputWrapper}>
                        <div
                            role="presentation"
                            onClick={this.handleClick}
                            className={calendarFakeInputMirror}
                        />
                        <input
                            id={id}
                            onFocus={this.handleFocus}
                            type="datetime"
                            placeholder={placeholder}
                            className={style.calendarFakeInput}
                            value={displayedDate}
                            readOnly={true}
                        />
                    </div>
                    <button
                        onClick={this.handleClearValueClick}
                        className={closeCalendarIconBtn}
                    >
                        <Icon icon="times"/>
                    </button>
                </div>
                <Collapse isOpened={this.state.isOpen}>
                    <button
                        className={style.selectTodayBtn}
                        onClick={this.handleSelectTodayBtnClick}
                    >
                        {todayLabel}
                    </button>
                    <DatePicker
                        open={true}
                        defaultValue={editedValue}
                        dateFormat={!timeOnly}
                        utc={dateOnly}
                        displayTimeZone={displayTimezone}
                        locale={locale}
                        timeFormat={!dateOnly && 'HH:mm z'}
                        onChange={(changedValue) => this.handleChange(changedValue)}
                        timeConstraints={this.props.timeConstraints}
                    />
                    {timezoneSupport &&
                        <div>{this.renderTimezoneSelector(displayTimezone || '')}</div>
                    }
                    <Button
                        onClick={this.handleApply}
                        className={style.applyBtn}
                        style="brand"
                        disabled={(this.state.transientDate && editedValue) ? this.state.transientDate.format(labelFormat) !== editedValue.format(labelFormat) : false}
                    >
                        {applyLabel}
                    </Button>
                </Collapse>
            </div>
        );
    }

    renderTimezoneSelector = (timezone) => {
        const mappedOptions = moment.tz.names().map((timezoneName) => {
                return {label: timezoneName, disabled: false, icon: ''};
        });

        // @ts-ignore
        return <SelectBox
            displayLoadingIndicator={false}
            options={mappedOptions}
            optionValueField="label"
            ListPreviewElement={SelectBox_Option_SingleLine}
            value={timezone}
            allowEmpty={false}
            displaySearchBox={false}
            threshold={0}
            onValueChange={this.props.onDisplayTimezoneChange}
        />
    }

    handleClick = () => {
        if (!this.props.disabled) {
            this.toggle();
        }
    }

    handleFocus = () => {
        if (!this.props.disabled) {
            this.open();
        }
    }

    handleClearValueClick = () => {
        if (!this.props.disabled) {
            this.setState({isOpen: false}, () => {
                this.props.onChange(null);
            });
        }
    }

    handleApply = () => {
        this.setState({
            isOpen: false
        }, () => {
            this.props.onChange(this.state.transientDate ? this.state.transientDate.utc().toDate() : null);
        });
    }

    handleChange = (value) => {
        const momentVal: Moment = isMoment(value) ? value : moment(value);
        this.setState({
            transientDate: momentVal
        });
    }

    handleSelectTodayBtnClick = () => {
        this.setState({
            isOpen: false
        }, () => {
            let date = moment().toDate();
            if (this.props.dateOnly) {
                date = moment().utc().startOf('day').toDate();
            }
            this.props.onChange(date);
        });
    }

    handleClickOutside = () => this.close();

    toggle = () => {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    open = () => {
        this.setState({
            isOpen: true
        });
    }

    close = () => {
        this.setState({
            isOpen: false
        });
    }
}
