/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * September 01, 2020 by Jay Liu
 */

// eslint-disable-next-line no-unused-vars
import { types, routes, getAsync } from '@onepacs/core';
import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { StudyList, LoadError } from '../components';

/**
 * This user should match the mock data used on the WebViewer server.
 * @type {types.UserIdentity}
 */
const userIdentity = {
    userId: 'demoUser',
    token: 'MOCK_USER_TOKEN',
};

function StudyListRouting() {
    /** @type {types.useState<types.GetStudiesResult>} */
    const [itemToOpen, setItemToOpen] = useState();
    /** @type {types.useState<types.GetStudiesResult[]>} */
    const [items, setItems] = useState([]);
    /** @type {types.useState<Error?>} */
    const [error, setError] = useState(undefined);

    useEffect(() => {
        async function fetchAsync() {
            // Fetch the list of test data from the server
            const { result, error: getError } = await getAsync(routes.server.testing.testdata);

            if (result) {
                /** @type {types.GetStudiesResultMessage[]} */
                const messages = result;
                const getStudiesResults = messages.map(m => m.result);
                setItems(getStudiesResults);
            } else {
                setError(getError);
            }
        }

        fetchAsync();
    }, [])

    return (
        itemToOpen
            ? <Redirect to={{
                pathname: routes.client.standalone,
                state: { itemToOpen, userIdentity }
            }} />
            : error
                ? <LoadError message='Error loading test data.' error={error} />
                : <StudyList items={items} onSelectItem={setItemToOpen} />
    );
}

export default StudyListRouting;
