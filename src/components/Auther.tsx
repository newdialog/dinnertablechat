import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useRef, useState } from 'react';

import * as AppModel from '../models/AppModel';

export var Auther = observer(function AutherFunc(props:any) {
    const store = useContext(AppModel.Context)!;
    const redirecting = useRef(false);

    useEffect( () => {
        if(store.auth.isNotLoggedIn || !store.auth.user) { // && !store.auth.user
            if(!redirecting.current) {
                store.router.push('/');
                redirecting.current = true;
            }
        }
    }, [store, store.auth, store.auth.user]);

    return props.children;
});