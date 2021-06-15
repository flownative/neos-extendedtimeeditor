import manifest from '@neos-project/neos-ui-extensibility';
import React from 'react';
import DateTimeEditor from './DateTimeEditor';

manifest('Flownative.Neos.ExtendedTimeEditor/DateTimeEditor', {}, globalRegistry => {
    const editorsRegistry = globalRegistry.get('inspector').get('editors');

    console.log(DateTimeEditor);
    editorsRegistry.set('Flownative.Neos.ExtendedTimeEditor/DateTimeEditor', {
        component: DateTimeEditor
    });
});
