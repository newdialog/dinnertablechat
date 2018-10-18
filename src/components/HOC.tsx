
import { translate } from 'react-i18next';
import withRoot from '../withRoot';
import {observer} from 'mobx-react';
import {
    withStyles
  } from '@material-ui/core/styles';

function noop(comp:any):any {
    return comp;
}

function noopHOC():any {
    return noop;
}

export default function HOC(Component:any, styles:any = null, noTranslate:boolean = false) {
    const withStylesWrap = styles ? withStyles : noop;
    const translateWrap = noTranslate ? noopHOC : translate;
    
    return translateWrap()(withRoot(withStylesWrap(styles)(observer(Component))));
}