// import url from 'url';

export interface Card {
  id: string;
  topic?: string;
  photo?: string;
  positions: string[];
  proposition: string;
}

/*
export function getCardSet(i: number, t: any): Card[] {
  const getSaaSQKey = _topicid => i => prefix + '-' + _topicid + '-q' + i;

  const positionsStr = t('topic' + i + '-positions', 'Yes, No');
  const positions = positionsStr.split(', ');

  return {
    topic: t('topic' + i + '-topic', ''),
    photo: t('topic' + i + '-photo', ''),
    positions,
    proposition: t('topic' + i + '-proposition'),
    id: t('topic' + i + '-id')
  };
}
*/

export function getTopics(t: any): Card[] {
  const topics = Number.parseInt(t('topics-num'), 10);

  const data: Card[] = [];
  for (let i = 0; i < topics; i++) {
    const positionsStr = t('topic' + i + '-positions', 'Yes, No');
    const positions = positionsStr.split(', ');

    data.push({
      topic: t('topic' + i + '-topic', ''),
      photo: t('topic' + i + '-photo', ''),
      positions,
      proposition: t('topic' + i + '-proposition'),
      id: t('topic' + i + '-id')
    });
  }
  return data;
}

export function getGroups(confid: string, t: any): string[] {
  return [];

  // TODO custom group names from DB
  /*
  const groupNames = t(`conf-${confid}-groupNames`, '');
  if (groupNames === '') return [];

  const grousps = groupNames.split(', ');
  // console.log('groupNames', groupNames);
  return grousps;
  */
}

export function getGroupByIndex(confid: string, index: number, t: any) {
  const groups = getGroups(confid, t);
  if (index >= groups.length) {
    // intentionall console.error('invalid group', groups, index, confid);

    const startWithOne = index + 1;
    return startWithOne.toString(); // toString
  }
  return groups[index];
}

export function getOtherTopics(
  topicid: string,
  t: any,
  prefix?: string
): Card[] {
  if (!prefix) prefix = 'saas';
  // utility
  const getSaaSQKey = _topicid => i => prefix + '-' + _topicid + '-q' + i;
  // if not exists in sheet, use default
  if (!topicid || topicid === '') {
    topicid = t(prefix + '-DEFAULT-id');
    console.log('no q query param: pulled from saas-DEFAULT-id:', topicid);
  }
  if (!topicid) throw new Error('no matching default question');
  // get number of questions
  const keyT = prefix + '-' + topicid + '-qnum';
  const topics = Number.parseInt(t(keyT), 10);
  if (!topics) console.log('found no topics: ');

  const q = getSaaSQKey(topicid);

  const data: Card[] = [];
  for (let i = 0; i < topics; i++) {
    const qs = q(i);
    data.push({
      topic: t(qs + '-topic'),
      photo: t(qs + '-photo'),
      positions: t(qs + '-positions', 'Yes, No').split(', '),
      proposition: t(qs + '-proposition'),
      id: t(qs + '-id')
    });
  }
  if (data.length === 0) console.log('found no questions:', topicid);
  return data;
}

export function getTopicByIndex(index: number, t: any): Card {
  const topics = Number.parseInt(t('topics-num'), 10);

  const data: Card[] = getTopics(t);
  return data[index];
}

export function getOldTopics(t: any) {
  const topics = t('topics-old').split(',');
  const data: Card[] = [];
  for (let i = 0; i < topics.length; i++) {
    const id = topics[i]; // key
    data.push({
      topic: t(id + '-topic'),
      photo: t(id + '-photo'),
      positions: t(id + '-positions', 'Yes, No').split(', '),
      proposition: t(id + '-proposition'),
      id: t(id + '-id')
    });
  }
  return data;
}

export function getTopic(id: string, t: any): Card | null {
  // const topics = Number.parseInt(t('topics-num'), 10);

  if (id === '' || !id) return getTopics(t)[0];
  const data: Card[] = getTopics(t)
    .concat(getOldTopics(t))
    .filter(card => card.id === id);

  return data.length === 0
    ? {
        id: '0',
        topic: '',
        photo: '',
        positions: ['', ''],
        proposition: ''
      }
    : data[0];
}
