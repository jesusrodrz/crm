import { useState, useEffect } from 'react';
import { firebaseApp, db } from '../firebase/firebase';

// eslint-disable-next-line import/prefer-default-export
export const useAuth = () => {
  const [auth, setAuth] = useState({
    login: false,
    user: false,
    authenticated: false,
    loading: true
  });
  const { login, user, authenticated, loading } = auth;
  useEffect(() => {
    const unsubcribe = firebaseApp.auth().onAuthStateChanged(async authUser => {
      if (authUser) {
        const userSnapshot = await db
          .collection('usersData')
          .doc(authUser.uid)
          .get();
        const data = userSnapshot.exists ? userSnapshot.data() : {};
        setAuth({
          login: false,
          user: { ...authUser, data },
          authenticated: true,
          loading: false
        });
      } else {
        setAuth({ login: true, authenticated: false, loading: false });
        console.log('no hay usuario');
      }
    });
    return unsubcribe;
  }, []);

  return {
    login,
    user,
    authenticated,
    setAuth,
    loading
  };
};
export const useUsers = adminUid => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!adminUid) {
      return () => {};
    }
    const usersData = db
      .collection('usersData')
      .where('userAdmin', '==', adminUid)
      .onSnapshot(snapshot => {
        const usersSanp = snapshot.docs.map(doc => ({ ...doc.data() }));
        setLoading(false);
        setUsers(usersSanp);
      });
    return () => {
      // unsubcribe sanpshot listener
      usersData();
    };
  }, [adminUid]);

  return {
    users,
    loading
  };
};
export const useCollection = (collection, query) => {
  const [key, operator, value] = query;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    console.log('run');
    if (!value) {
      return () => {};
    }
    const dbQuery = value
      ? db.collection(collection).where(key, operator, value)
      : db.collection(collection);

    const usersData = dbQuery.onSnapshot(snapshot => {
      const usersSanp = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }));
      if (loading) {
        setLoading(false);
      }
      setData(usersSanp);
    });
    return () => {
      // unsubcribe sanpshot listener
      usersData();
    };
  }, [key, operator, value, collection, loading]);

  return [data, loading];
};
export const useCollectionByRef = (collection, query) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const queryString = JSON.stringify(query);
  useEffect(() => {
    if (!queryString) {
      return () => {};
    }
    const parsedQuery = JSON.parse(queryString);
    const dbQuery = parsedQuery.where.reduce((newQuery, value) => {
      if (!value) {
        return newQuery;
      }
      if (value[2] === undefined || value[2] === null) {
        return newQuery;
      }
      return newQuery.where(...value);
    }, db.collection(collection));
    // console.log(dbQuery);
    const snapshotData = dbQuery.onSnapshot(snapshot => {
      const snapshotDocsData = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }));
      if (loading) {
        setLoading(false);
      }
      setData(snapshotDocsData);
    });
    return () => {
      // unsubcribe sanpshot listener
      snapshotData();
    };
  }, [queryString, loading, collection]);

  return [data, loading];
};
