import {getAll, submit} from '../services/ConfService';
import {match2} from '../services/ConfMath';

it('matches', async () => {
    const groups = 3;
    const data = [
        {user:'123', answers: {'1':1,'2':0}},
        {user:'222', answers: {'1':0,'2':0}},
        {user:'333', answers: {'1':1,'2':1}},
        {user:'444', answers: {'1':1,'2':1}},
        {user:'555', answers: {'1':0,'2':1}}
    ]
    const result = match2(data, groups);

    // console.log(JSON.stringify(result));

    expect(result!==null);

    expect(Object.keys(result).length < groups);
    expect(Object.keys(result).length > 1);

    // expect(Object.keys(result[0]).length > 1);

    const userKeys = result.map(h=>Object.keys(h)).reduce((acc,x)=>acc.concat(x), []);
    expect( userKeys ).toContain('333');
    expect( userKeys.length === data.length);

    // console.log('result', result, Object.keys(result).length );
});