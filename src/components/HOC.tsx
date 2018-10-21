
import { withNamespaces } from 'react-i18next';
import withRoot from '../withRoot';
import {observer} from 'mobx-react';
import {
    withStyles
  } from '@material-ui/core/styles';

function noop(comp:any):any {
    return comp;
}

function noopHOC(noprop:any = null):any {
    return noop;
}

export default function HOC(Component:any, styles:any = null, noTranslate:boolean = false) {
    const withStylesWrap = styles ? withStyles : noopHOC;
    const translateWrap = noTranslate ? noopHOC : withNamespaces;
    
    return translateWrap()(withRoot(withStylesWrap(styles)(observer(Component))));
}