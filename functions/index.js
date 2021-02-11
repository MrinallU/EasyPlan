const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

const newActivity = (type, event, id) => {
  return {
    type: type,
    eventDate: event.date,
    hostedBy: event.hostedBy,
    title: event.title,
    photoURL: event.hostPhotoURL,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
    hostUid: event.hostUid,
    eventId: id
  };
};

exports.createActivity = functions.firestore
  .document('events/{eventId}')
  .onCreate(event => {
    let newEvent = event.data();

    console.log(newEvent);

    const activity = newActivity('newEvent', newEvent, event.id);

    console.log(activity);

    return admin
      .firestore()
      .collection('activity')
      .add(activity)
      .then(docRef => {
        return console.log('Activity created with ID ', docRef.id);
      })
      .catch(err => {
        return console.log('Error adding activity', err);
      });
  });

exports.cancelActivity = functions.firestore
  .document('events/{eventId}')
  .onUpdate((event, context) => {
    let updatedEvent = event.after.data();
    let previousEventData = event.before.data();
    console.log({ event });
    console.log({ context });
    console.log({ updatedEvent });
    console.log({ previousEventData });

    if (
      !updatedEvent.cancelled ||
      updatedEvent.cancelled === previousEventData.cancelled
    )
      return false;

    const activity = newActivity(
      'cancelledEvent',
      updatedEvent,
      context.params.eventId
    );

    console.log({ activity });

    return admin
      .firestore()
      .collection('activity')
      .add(activity)
      .then(docRef => {
        return console.log('Activity created with ID ', docRef.id);
      })
      .catch(err => {
        return console.log('Error adding activity', err);
      });
  });

exports.addFollowing = functions.firestore
    .document('following/{userUid}/userFollowing/{profileId}')
    .onCreate(async (snapshot, context) => {
        const following = snapshot.data();
        console.log({ following });
        try {
            const userDoc = await db
                .collection('users')
                .doc(context.params.userUid)
                .get();
            const batch = db.batch();
            batch.set(
                db
                    .collection('following')
                    .doc(context.params.profileId)
                    .collection('userFollowers')
                    .doc(context.params.userUid),
                {
                    displayName: userDoc.data().displayName,
                    photoURL: userDoc.data().photoURL,
                    uid: userDoc.id,
                }
            );
            batch.update(db.collection('users').doc(context.params.profileId), {
                followerCount: admin.firestore.FieldValue.increment(1),
            });
            return await batch.commit();
        } catch (error) {
            return console.log(error);
        }
    });

exports.removeFollowing = functions.firestore
    .document('following/{userUid}/userFollowing/{profileId}')
    .onDelete(async (snapshot, context) => {
        const batch = db.batch();
        batch.delete(
            db
                .collection('following')
                .doc(context.params.profileId)
                .collection('userFollowers')
                .doc(context.params.userUid)
        );
        batch.update(db.collection('users').doc(context.params.profileId), {
            followerCount: admin.firestore.FieldValue.increment(-1),
        });
        try {
            return await batch.commit();
        } catch (error) {
            return console.log(error);
        }
    });

exports.eventUpdated = functions.firestore
    .document('events/{eventId}')
    .onUpdate(async (snapshot, context) => {
        const before = snapshot.before.data();
        const after = snapshot.after.data();
        if (before.attendees.length < after.attendees.length) {
            let attendeeJoined = after.attendees.filter(item1 => !before.attendees.some(item2 => item2.id === item1.id))[0];
            console.log({attendeeJoined});
            try {
                const followerDocs = await db.collection('following').doc(attendeeJoined.id).collection('userFollowers').get();
                followerDocs.forEach(doc => {
                    admin.database().ref(`/posts/${doc.id}`).push(newPost(attendeeJoined, 'joined-event', context.params.eventId, before))
                })
            } catch (error) {
                return console.log(error);
            }
        }
        if (before.attendees.length > after.attendees.length) {
            let attendeeLeft = before.attendees.filter(item1 => !after.attendees.some(item2 => item2.id === item1.id))[0];
            console.log({attendeeLeft});
            try {
                const followerDocs = await db.collection('following').doc(attendeeLeft.id).collection('userFollowers').get();
                followerDocs.forEach(doc => {
                    admin.database().ref(`/posts/${doc.id}`).push(newPost(attendeeLeft, 'left-event', context.params.eventId, before))
                })
            } catch (error) {
                return console.log(error);
            }
        }
        return console.log('finished');
    })

function newPost(user, code, eventId, event) {
    return {
        photoURL: user.photoURL,
        date: admin.database.ServerValue.TIMESTAMP,
        code,
        displayName: user.displayName,
        eventId,
        userUid: user.id,
        title: event.title
    }
}