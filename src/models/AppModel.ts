import { types } from 'mobx-state-tree'
import { RouterModel } from 'mst-react-router';

const AppModel = types.model({
    text: 'DEFAULT VAL',
    completed: false,
    id: 0,
    router: RouterModel
})
.actions(self => ({
    // note the `({`, we are returning an object literal
    setTitle(newTitle:string) {
        self.text = newTitle
    }
}))

export default AppModel;