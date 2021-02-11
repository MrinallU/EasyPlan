import React, { Component, Fragment } from 'react';
import EventListItem from './EventListItem';
import InfiniteScroll from 'react-infinite-scroller';

class EventList extends Component {
  render() {
    const { events, getNextEvents, loading, moreEvents, term } = this.props;
    console.log(term)
    return (
      <Fragment>
        {events && events.length !== 0 && (
          <InfiniteScroll
            pageStart={0}
            loadMore={getNextEvents}
            hasMore={!loading && moreEvents}
            initialLoad={false}
          >
            {events && term == null &&
              events.map(event => (
                <EventListItem key={event.id} event={event} />
              ))}
            {events && term != null &&
            events.filter(event => event.title.includes(term)).map( event1 => (
                    <EventListItem key={event1.id} event={event1} />
            ))}
          </InfiniteScroll>
        )}
      </Fragment>
    );
  }
}

export default EventList;
