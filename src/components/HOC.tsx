import { withTranslation, UseTranslationResponse } from 'react-i18next';
import withRoot from '../withRoot';
// import { observer } from 'mobx-react';
import * as AppModel from '../models/AppModel';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import { useTheme, makeStyles } from '@material-ui/styles';

function noop(comp: any) {
  return comp;
}

function noopHOC(noprop?: any) {
  return noop;
}
/*
export default function HOC(
  Component: any,
  styles: any = null,
  noTranslate: boolean = false
) {
  const withStylesWrap = styles ? withStyles : noopHOC;
  const translateWrap = noTranslate ? noopHOC : (withTranslation as any);

  if (styles)
    return translateWrap()(withRoot(withStyles(styles)(observer(Component))));
  else return translateWrap()(withRoot(observer(Component)));
  // return translateWrap()(withRoot(withStylesWrap(styles)(observer(Component))));
}

export function Authed(Component: any) {
  return (props: any) => {
    const store: AppModel.Type = props.store;
    if (store.auth.isNotLoggedIn) store.router.push('/');
    if (store.auth.user) return <Component {...props} />;
    else
      return (
        <div>
          <br />
          <br />
          <br />
          <br />
          LOADING
        </div>
      );
  };
}

export const Hooks = (baseComponent, useSelector?) =>
  // React.useMemo(() => 
    props => {
      const store = useContext(AppModel.Context);
      const selected = useSelector ? useSelector(store) : { store };
      const {t} = useTranslation();

      return observer( baseComponent({ ...selected, ...props, t }) );
    }// ,
    // [AppModel.Context, baseComponent]
  // );
export interface IHook {
    t: any,
    store: AppModel.Type
}
*/