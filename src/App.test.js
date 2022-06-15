import {render, fireEvent, waitFor, screen, cleanup, getNodeText, prettyDOM} from '@testing-library/react';
import '@testing-library/jest-dom'
import Table from './components/Table';
import {rest} from 'msw';
import {setupServer} from 'msw/node';
import { getData } from './data/getMockData';

let resPonseData = null;

const server = setupServer(
  rest.get('https://reqres.in/api/users', (req, res, ctx) => {
    const per_page = req.url.searchParams.get('per_page');
    const page = req.url.searchParams.get('page');
    resPonseData = getData(page, per_page);
    return res(ctx.json(resPonseData));
  })
);

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
afterEach(cleanup);

describe('Test-suite', () => { 
  test('test-1',  async () => {
    render(<Table />);
    expect(screen.getByTestId('loading')).toHaveTextContent('Loading...');
    await waitFor(() => screen.getAllByTestId('content'));
    expect(screen.getAllByTestId('content')).toHaveLength(109);
  });

  test('test-2',  async () => {
    render(<Table  />);
    fireEvent.click(screen.getByTestId('next page'));
    expect(screen.getByTestId('loading')).toHaveTextContent('Loading...');
    await waitFor(() => screen.getAllByTestId('content'));
    //Test For length
    expect(screen.getAllByTestId('content')).toHaveLength(resPonseData?.data?.length);

    //Test for some content
    expect(screen.getByTestId('table')).toHaveTextContent(resPonseData?.data[0].first_name);
  });

  test('test-3',  async () => {
    render(<Table />);
    fireEvent.click(screen.getByTestId('previous page'));
    expect(screen.getByTestId('loading')).toHaveTextContent('Loading...');
    await waitFor(() => screen.getAllByTestId('content'));
    expect(screen.getAllByTestId('content')).toHaveLength(resPonseData?.data?.length);

    //Test for some content
    expect(screen.getByTestId('table')).toHaveTextContent(resPonseData?.data[0].first_name);
  });

  test('test-4',  async () => {
    server.use(
      rest.get('https://reqres.in/api/users', (req, res, ctx) => {
        const per_page = req.url.searchParams.get('per_page');
        const page = req.url.searchParams.get('page');
        resPonseData = getData(page, per_page);
        return res(ctx.json(resPonseData));
      }),
    );
    render(<Table />);
    fireEvent.change(screen.getByTestId('select'), {target: {value: 10}});
    expect(screen.getByTestId('loading')).toHaveTextContent('Loading...');
    await waitFor(() => screen.getAllByTestId('content'));
    expect(screen.getAllByTestId('content')).toHaveLength(resPonseData?.data?.length);

    //Test for some content
    expect(screen.getByTestId('table')).toHaveTextContent(resPonseData?.data[0].first_name);

  });

   test('test-5',  async () => {
    server.use(
      rest.get('https://reqres.in/api/users', (req, res, ctx) => {
        return res(ctx.status(500))
      }),
    );
    render(<Table />);
    fireEvent.click(screen.getByTestId('next page'));
    expect(screen.getByTestId('loading')).toHaveTextContent('Loading...');
    await waitFor(() => screen.getByTestId('noData'));
    expect(screen.getByTestId('noData')).toHaveTextContent("No Data Found...");
  });

  test('test-6',  async () => {
    render(<Table />);
    //2 Times clicked next
    fireEvent.click(screen.getByTestId('next page'));
    fireEvent.click(screen.getByTestId('next page'));
    expect(screen.getByTestId('loading')).toHaveTextContent('Loading...');
    await waitFor(() => screen.getAllByTestId('content'));
    expect(screen.getAllByTestId('content')).toHaveLength(resPonseData?.data?.length);
     //Test for some content
    expect(screen.getByTestId('table')).toHaveTextContent(resPonseData?.data[0].first_name);

    server.use(
      rest.get('https://reqres.in/api/users', (req, res, ctx) => {
        return res(ctx.status(500))
      }),
    );
    //3rd time API failed
    fireEvent.click(screen.getByTestId('next page'));
    expect(screen.getByTestId('loading')).toHaveTextContent('Loading...');
    await waitFor(() => screen.getByTestId('noData'));
    expect(screen.getByTestId('noData')).toHaveTextContent("No Data Found...");

    server.use(
      rest.get('https://reqres.in/api/users', (req, res, ctx) => {
        const per_page = req.url.searchParams.get('per_page');
        const page = req.url.searchParams.get('page');
        resPonseData = getData(page, per_page);
        return res(ctx.json(resPonseData));
      }),
    );

    fireEvent.click(screen.getByTestId('previous page'));
    expect(screen.getByTestId('loading')).toHaveTextContent('Loading...');
    await waitFor(() => screen.getAllByTestId('content'));
    expect(screen.getAllByTestId('content')).toHaveLength(resPonseData?.data?.length);
     //Test for some content
    expect(screen.getByTestId('table')).toHaveTextContent(resPonseData?.data[0].first_name);
  });
 });

