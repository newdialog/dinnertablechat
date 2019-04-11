import React, { useState, useEffect, useContext, useRef } from 'react';
import { createStyles, WithStyles, Theme } from '@material-ui/core/styles';
import * as AppModel from '../models/AppModel';
import { observer } from 'mobx-react-lite';

export var Auther = observer(function Auther(props:any) {
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