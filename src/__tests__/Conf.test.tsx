import {getAll, submit, delAll, submitAll} from '../services/ConfService';
import {match2} from '../services/ConfMath';

const TEST_CONF_ID = 'test';

const TEST_DATA = [
    {user:'123', answers: {'1':1,'2':0}},
    {user:'222', answers: {'1':0,'2':0}},
    {user:'333', answers: {'1':1,'2':1}},
    {user:'444', answers: {'1':1,'2':1}},
    {user:'555', answers: {'1':0,'2':1}},
    {user:'666', answers: {'1':0,'2':1}},
    {user:'777', answers: {'1':1,'2':0}},
    {user:'888', answers: {'1':0,'2':1}},
    {user:'999', answers: {'1':1,'2':1}}
]

afterAll( () => {
    
});

it('add_test_data', async () => {
    // await submitAll(TEST_DATA, TEST_CONF_ID);
    // delAll(TEST_CONF_ID);
});

it('matches', async () => {
    const groups = 2;
    
    const result = match2(TEST_DATA, groups);

    // console.log(JSON.stringify(result));

    expect(result!==null);

    expect(Object.keys(result).length < groups);
    expect(Object.keys(result).length > 1);

    // expect(Object.keys(result[0]).length > 1);

    const userKeys = result.map(h=>Object.keys(h)).reduce((acc,x)=>acc.concat(x), []);
    expect( userKeys ).toContain('123');
    expect( userKeys ).toContain('999');
    expect( userKeys.length === TEST_DATA.length);

    // console.log('result', result, Object.keys(result).length );
}, 4000);