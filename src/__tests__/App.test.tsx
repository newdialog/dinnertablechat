import { fireEvent, render, wait, waitForElement, waitForElementToBeRemoved, cleanup } from '@testing-library/react';
import { getByText as getByText2 } from '@testing-library/dom';
import * as React from 'react';

import { App } from '../App';

afterEach(cleanup);

it('renders without crashing', async () => {
  const { getByTestId, getByText, queryByText, findByRole, getByLabelText, container } = render(<App />);

  const greetingTextNode = await waitForElement(() =>
    getByTestId('loading')
  );
  // see if something comes up
  expect(queryByText('Loading', {exact: false}) !== null || 
        queryByText('match', {exact: false}) !== null || 
        queryByText('DTC', {exact: false}) !== null
  );

}, 8000);
