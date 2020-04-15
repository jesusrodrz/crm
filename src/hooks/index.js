import { useState, useEffect, useCallback } from 'react';
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

  return [data, loading, setData];
};
export const useCollectionByRef = (collection, query) => {
  const [data, setData] = useState([]);

  const [loading, setLoading] = useState(true);

  const queryString = JSON.stringify(query);

  useEffect(() => {
    if (!queryString) {
      return () => {};
    }
    setLoading(true);
    let updateLoading = true;
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
    const snapshotData = dbQuery.onSnapshot(snapshot => {
      console.log('querySnapshot: ', collection);
      const snapshotDocsData = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }));
      if (updateLoading) {
        updateLoading = false;
        setLoading(false);
      }
      setData(snapshotDocsData);
    });
    return () => {
      // unsubcribe sanpshot listener
      snapshotData();
    };
  }, [queryString, collection]);

  return [data, loading];
};
export const useCollectionCallback = (collection, callbackQuery) => {
  const [{ data, loading }, setData] = useState({ data: [], loading: false });

  const setDataArr = useCallback(newData => {
    setData(state => ({ ...state, data: newData }));
  }, []);
  useEffect(() => {
    if (!callbackQuery) {
      return () => {};
    }
    const query = callbackQuery(db.collection(collection));
    if (!query) {
      return () => {};
    }
    setData(state => ({ ...state, loading: true }));
    const unsubcribe = query.onSnapshot(snapshot => {
      console.log('querySnap: ', collection);
      const dataSnap = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }));

      setData({ data: dataSnap, loading: false });
    });

    return () => unsubcribe();
  }, [callbackQuery, collection]);

  return [data, loading, setDataArr];
};

export function usePrint() {
  const [printing, setPrinting] = useState(false);
  const print = useCallback(() => {
    setPrinting(true);
  }, []);
  // const

  useEffect(() => {
    let timeout;
    if (printing) {
      timeout = setTimeout(() => {
        window.print();
        setPrinting(false);
      }, 1000);
    }

    return () => {
      console.log('cleaning timeout: ', timeout);
      clearTimeout(timeout);
    };
  }, [printing]);
  return [printing, print];
}
