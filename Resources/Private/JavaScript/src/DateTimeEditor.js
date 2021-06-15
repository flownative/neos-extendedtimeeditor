import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ExtendedDateInput from './dateInput';
import moment, {isMoment} from 'moment-timezone';
import {neos} from '@neos-project/neos-ui-decorators';
import convertPhpDateFormatToMoment, {hasDateFormat, hasTimeFormat} from './helpers';
import {connect} from 'react-redux';
import {$transform, $get} from 'plow-js';

import {DateInput} from '@neos-project/react-ui-components';

@neos(globalRegistry => ({
    i18nRegistry: globalRegistry.get('i18n')
}))
@connect(state => $transform({
    interfaceLanguage: $get('user.preferences.interfaceLanguage')
}))
class DateTimeEditor extends Component {
    state = {selectedTimezone: null}

    static propTypes = {
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
        commit: PropTypes.func.isRequired,
        className: PropTypes.string,
        options: PropTypes.shape({
            format: PropTypes.string,
            placeholder: PropTypes.string,
            minuteStep: PropTypes.number,
            timeConstraints: PropTypes.object
        }),
        id: PropTypes.string,
        i18nRegistry: PropTypes.object,
        interfaceLanguage: PropTypes.string
    }

    hasTimezoneSupport = () => {
        const {
            options
        } = this.props;
        return !!$get('timezoneSupport', options);
    }

    // TODO Support for user preference storage of preferred timezone
    // Sadly that is not possible outside of the core atm
    preferredDisplayTimezone = () => {
        const {
            options
        } = this.props;
        return $get('preferredTimezone', options) || null;
    }

    decideDisplayTimezone = () => {
        if (!this.hasTimezoneSupport()) {
            return 'UTC';
        }
        return this.state.selectedTimezone || (this.preferredDisplayTimezone || moment.tz.guess());
    }

    onTimezoneChange = selectedTimezone => {
        this.setState({
            selectedTimezone
        });
    }

    onChange = date => {
        const momentObject = date && (isMoment(date) ? date : moment(date));
        this.props.commit(momentObject ? momentObject.format('YYYY-MM-DDTHH:mm:ssZ') : '');
    };

    render() {
        const {
            id,
            className,
            value,
            options,
            i18nRegistry,
            interfaceLanguage
        } = this.props;
        const mappedValue = (typeof value === 'string' && value.length) ? moment(value).utc().toDate() : (value || undefined);
        const timezoneSupport = this.hasTimezoneSupport();

        const timeConstraints = Object.assign({
            minutes: {
                step: $get('minuteStep', options) || 5
            }
        }, $get('timeConstraints', options));

        return (
            <div>
            <ExtendedDateInput
                id={id}
                className={className}
                value={mappedValue}
                onChange={this.onChange}
                labelFormat={convertPhpDateFormatToMoment(options.format)}
                dateOnly={!hasTimeFormat(options.format)}
                timeOnly={!hasDateFormat(options.format)}
                placeholder={i18nRegistry.translate($get('placeholder', options) || 'Neos.Neos:Main:content.inspector.editors.dateTimeEditor.noDateSet')}
                todayLabel={i18nRegistry.translate('content.inspector.editors.dateTimeEditor.today', 'Today', {}, 'Neos.Neos', 'Main')}
                applyLabel={i18nRegistry.translate('content.inspector.editors.dateTimeEditor.apply', 'Apply', {}, 'Neos.Neos', 'Main')}
                locale={interfaceLanguage}
                disabled={options.disabled}
                timeConstraints={timeConstraints}
                timezoneSupport={timezoneSupport}
                displayTimezone={this.decideDisplayTimezone()}
                onDisplayTimezoneChange={this.onTimezoneChange}
            />
            </div>
        );
    }
}

export default DateTimeEditor;
