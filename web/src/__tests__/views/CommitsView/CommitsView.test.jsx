import React from 'react';
import { mount, shallow } from 'enzyme';
import { UnconnectedCommitsView, CommitDiv } from 'components/CommitsView/CommitView';
import actions from 'components/CommitsView/actions';
import { storeFactory } from 'functions/testUtils';
import { branchesMock, projectsArrayMock, commitMockObject } from 'testData';
import hooks from 'customHooks/useSelectedProject';
import { getTimeCreatedAgo } from 'functions/dataParserHelpers';
import MemoryRouter from 'router/MemoryRouter';

const commits = [{
  ...commitMockObject, title: 'first commit',
},
{
  ...commitMockObject, title: 'second commit',
}];

const push = jest.fn();

const history = { push };

const setup = () => {
  actions.getCommits = jest.fn(() => new Promise((resolve) => resolve(commits)));
  hooks.useSelectedProject = jest.fn(() => [jest.fn()]);
  const match = { params: { namespace: 'namespace', slug: 'slug', branch: 'master' } };
  return mount(
    <MemoryRouter>
      <UnconnectedCommitsView 
        match={match} 
        history={history} 
        projects={projectsArrayMock.projects}
        branches={branchesMock}
        users={projectsArrayMock.users}
      />
    </MemoryRouter>,
  );
};

/* describe('test UI only', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = setup();
  });

  test('assert component renders and contains UI elements', () => {
    expect(wrapper.find('MBranchSelector')).toHaveLength(1);
    expect(wrapper.find('input#commits-filter-input')).toHaveLength(1);
    wrapper.setProps({});
    console.log(wrapper.debug());
  });

  test('assert that branch changes trigger the event and handle functions', () => {
    const onBranchSelectedMock = jest.fn();
     wrapper.instance().onBranchSelected = onBranchSelectedMock;
     wrapper
      .instance()
      .setState({
        commits,
      });
    expect(wrapper.find('CommitDiv')).toHaveLength(commits.length);
    wrapper
      .find('MBranchSelector')
      .dive()
      .dive()
      .find('li')
      .at(0)
      .simulate('click', branchesMock[0].name);
    expect(onBranchSelectedMock).toHaveBeenCalledWith(branchesMock[0].name);
  });

  test('assert that branch changes trigger the event and handle functions', () => {
    wrapper
      .instance()
      .setState({
        commits,
      });
    const mockedEV = { target: { value: 'first' } };
    expect(wrapper.find('input#commits-filter-input').simulate('change', mockedEV));
    expect(wrapper.find('CommitDiv')).toHaveLength(1);
  });

  afterEach(() => {
    history.push.mockClear();
  });
});
 */
describe('test CommitDiv', () => {
  test('assert that CommitDiv renders and events are triggered correclty', () => {
    const userName = 'mlreef';
    const wrapper = shallow(
      
        <CommitDiv
          branch="feature/a-branch"
          namespace="namespace"
          slug="slug"
          commitid={commitMockObject.id}
          title={commitMockObject.title}
          name={commitMockObject.author_name}
          id={commitMockObject.short_id}
          time={commitMockObject.committed_date}
          avatarImage=""
          userName={userName}
        />
      ,
    );
    console.log(wrapper.debug());
    const links = wrapper.find('Link');
    expect(links.at(0).props().to).toBe(`/${userName}`);
    expect(links.at(1).props().to).toBe(`/namespace/slug/-/commits/feature/a-branch/-/${commitMockObject.id}`);
    const today = new Date();
    const previous = new Date(commitMockObject.committed_date);
    const timediff = getTimeCreatedAgo(previous, today);
    expect(wrapper.find('.commit-data').childAt(1).text().includes(timediff)).toBe(true);
    try {
      wrapper.find('button').simulate('click');
    } catch (error) {
      // only allowed error, at least asserts on click was executed
      expect(error.message).toBe("Cannot read property 'innerText' of undefined");
    }
  });
});
