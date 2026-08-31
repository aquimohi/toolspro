const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'App.tsx');
let code = fs.readFileSync(filePath, 'utf8');

// 1. Add Firebase imports after other imports
const importTarget = "import { SUBSCRIPTION_PLANS } from './data/subscriptionPlans';";
const firebaseImports = `import { SUBSCRIPTION_PLANS } from './data/subscriptionPlans';
import { auth, db } from './lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';`;
code = code.replace(importTarget, firebaseImports);

// 2. Add Firebase Auth State Listener in useEffect
const useEffectTarget = `  // Close export dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(e.target as Node)) {
        setIsExportMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);`;
const firebaseListener = `  // Close export dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(e.target as Node)) {
        setIsExportMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Firebase Auth State Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const profile = userDoc.data() as UserProfile;
            setCurrentUser(profile);
            localStorage.setItem('web_util_user', JSON.stringify(profile));
          }
        } catch (err) {
          console.error("Failed to fetch user profile:", err);
        }
      } else {
        setCurrentUser(null);
        localStorage.removeItem('web_util_user');
      }
    });

    return () => unsubscribe();
  }, []);`;
code = code.replace(useEffectTarget, firebaseListener);

// 3. Update handleLogout and handleUpdateUser
const handleLogoutTarget = `  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('web_util_user');
    } catch {}
  };`;
const firebaseLogout = `  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Logout failed:", err);
    }
    setCurrentUser(null);
    try {
      localStorage.removeItem('web_util_user');
    } catch {}
  };`;
code = code.replace(handleLogoutTarget, firebaseLogout);

const handleUpdateUserTarget = `  const handleUpdateUser = (updated: UserProfile) => {
    setCurrentUser(updated);
    try {
      localStorage.setItem('web_util_user', JSON.stringify(updated));
    } catch {}
  };`;
const firebaseUpdateUser = `  const handleUpdateUser = async (updated: UserProfile) => {
    setCurrentUser(updated);
    try {
      localStorage.setItem('web_util_user', JSON.stringify(updated));
      if (updated.id) {
        await setDoc(doc(db, 'users', updated.id), updated);
      }
    } catch (err) {
      console.error("Failed to update user profile:", err);
    }
  };`;
code = code.replace(handleUpdateUserTarget, firebaseUpdateUser);

fs.writeFileSync(filePath, code);
console.log('App.tsx updated for Firebase successfully.');
