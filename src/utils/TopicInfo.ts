export interface Card {
  id: string;
  topic: string;
  photo: string;
  positions: string[];
  proposition: string;
}

export function getTopics(t: any): Card[] {
  const topics = Number.parseInt(t('topics-num'), 10);

  const data: Card[] = [];
  for (let i = 0; i < topics; i++)
    data.push({
      topic: t('topic' + i + '-topic'),
      photo: t('topic' + i + '-photo'),
      positions: t('topic' + i + '-positions').split(', '),
      proposition: t('topic' + i + '-proposition'),
      id: t('topic' + i + '-id')
    });
  return data;
}

export function getTopicByIndex(index: number, t: any): Card {
  const topics = Number.parseInt(t('topics-num'), 10);

  const data: Card[] = getTopics(t);
  return data[index];
}

export function getOldTopics(t) {
  const topics = t('topics-old').split(',');
  const data: Card[] = [];
  for (let i = 0; i < topics.length; i++) {
    const id = topics[i]; // key
    data.push({
      topic: t(id + '-topic'),
      photo: t(id + '-photo'),
      positions: t(id + '-positions').split(', '),
      proposition: t(id + '-proposition'),
      id: t(id + '-id')
    });
  }
  return data;
}

export function getTopic(id: string, t: any): Card | null {
  // const topics = Number.parseInt(t('topics-num'), 10);

  if (id === '' || !id) return getTopics(t)[0];
  const data: Card[] = getTopics(t).concat(getOldTopics(t)).filter(card => card.id === id);

  return data.length === 0 ? {
    id: '0',
    topic: '',
    photo: '',
    positions: ['',''],
    proposition: ''
  } : data[0];
}
