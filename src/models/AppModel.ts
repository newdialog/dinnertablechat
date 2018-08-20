import { types } from 'mobx-state-tree'
import { RouterModel } from '@jadbox/mst-react-router';

const UserModel = types.model({
    email: types.maybe(types.string),
    name: types.string,
    credits: types.integer,
    karma: types.integer
})

const AppModel = types.model({
    text: 'DEFAULT VAL',
    loggedIn: false,
    user: types.maybe(UserModel),
    router: RouterModel
})
.actions(self => ({
    setTitle(newTitle:string) {
        self.text = newTitle
    }
}))

export default AppModel;