// import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
// import { recordUserPreferences } from '../../../../redux/Api/ProfileApi';
// import { calculateMovieRating, getAllRated_with_preference, getRatedMovies, rollbackPairwiseDecisions } from '../../../../redux/Api/movieApi';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useDispatch } from 'react-redux';
// import { setModalClosed } from '../../../../redux/feature/modalSlice/modalSlice';

// export const useCompareComponent = (token: string) => {
//   // ---- Core state ----
//   const [selectedMovie, setSelectedMovie] = useState<any>(null);
//   const [selectedMovieId, setSelectedMovieId] = useState<string | null>(null);

//   const [comparisonMovies, setComparisonMovies] = useState<any[]>([]);
//   const [currentComparisonIndex, setCurrentComparisonIndex] = useState(0);

//   // Modal states (public API same)
//   const [isFeedbackVisible, setFeedbackVisible] = useState(false);
//   const [isComparisonVisible, setComparisonVisible] = useState(false);
//   const [stepsModal, setStepsModal] = useState<boolean>(false); // kept for compatibility
//   const [isStepsModalVisible, setStepsModalVisible] = useState(false);
//   const dispatch = useDispatch();

//   // Steps & preference
//   const [currentStep, setCurrentStep] = useState(0);
//   const [selectionHistory, setSelectionHistory] = useState<string[]>([]);
//   const [userPreference, setUserPreference] = useState<{
//     preference: 'love' | 'like' | 'dislike' | null;
//   }>({ preference: null });

//   // ---- Binary search bounds ----
//   const [low, setLow] = useState(0);
//   const [high, setHigh] = useState(0);
//   const [mid, setMid] = useState(0);
//   const [lastAction, setLastAction] = useState(null); // 'first' Or 'second'

//   const lowRef = useRef(0);
//   const highRef = useRef(0);
//   const midRef = useRef(0);

//   const fetchComparisonMovies = useCallback(async (pref?: 'love' | 'like' | 'dislike') => {
//     const preferenceToUse = pref || userPreference.preference;
//     if (!token || !selectedMovieId || !preferenceToUse) return [];

//     try {
//       let allResults: any[] = [];
//       let currentPage = 1;
//       let totalPages = 1;
//       while (currentPage <= totalPages) {
//         // const response = await getRatedMovies(token, currentPage);
//         const response = await getAllRated_with_preference(token, preferenceToUse)
//         const totalRated = response?.results?.length ?? 0;
//         setCurrentStep(totalRated);
//         console.log(response, "Initial step count loaded from RatedMovies");
//         await AsyncStorage.setItem('currentStep', String(totalRated));
//         console.log('getAllRated_with_preferenceTo_go_',response)
//         totalPages = response?.total_pages ?? 1;
//         currentPage = response?.current_page ?? currentPage;
//         allResults = [...allResults, ...(response?.results ?? [])];
//         currentPage += 1;
//       }
//       const filtered = allResults
//         .filter(m => m.imdb_id !== selectedMovieId)
//         .filter(m => m.preference === preferenceToUse)
//       // .sort((a, b) => a.title.localeCompare(b.title));
//       // console.log('work__properTOwork__', filtered)
//       setComparisonMovies(filtered);

//       // set binary search bounds
//       const length = filtered.length;
//       setLow(0);
//       lowRef.current = 0;
//       setHigh(length - 1);
//       highRef.current = length - 1;
//       setMid(Math.floor((length - 1) / 2)); // first pivot = median
//       midRef.current = Math.floor((length - 1) / 2);
//       return filtered.reverse();
//     } catch (err) {
//       console.error('fetchComparisonMovies error:', err);
//       return [];
//     }
//   }, [token, selectedMovieId, userPreference.preference]);

//   const secondMovieData = useMemo(() => {
//     if (!comparisonMovies.length) return null;
//     if (mid < 0 || mid >= comparisonMovies.length) return null;
//     console.log('comparision__data__hereTO_Pdd', comparisonMovies[mid])
//     return comparisonMovies[mid];
//   }, [comparisonMovies, mid]);

//   const resetComparisonData = useCallback(() => {
//     setComparisonMovies([]);
//     setCurrentComparisonIndex(0);
//   }, [isComparisonVisible, setComparisonVisible, setComparisonMovies, setCurrentComparisonIndex]);


//   const openFeedbackModal = useCallback((movie: any) => {
//     // setSelectedMovie(movie);
//     // setSelectedMovieId(movie?.imdb_id ?? null);
//     // setFeedbackVisible(true);
//     setSelectionHistory([]);
//     setComparisonMovies([]);
//     setCurrentComparisonIndex(0);
//     setSelectedMovie(movie);
//     setSelectedMovieId(movie?.imdb_id ?? null);
//     setFeedbackVisible(true);
//     fetchComparisonMovies();
//   // }, [isFeedbackVisible, isComparisonVisible,]);
//   }, [isFeedbackVisible, isComparisonVisible, setFeedbackVisible, setComparisonVisible, setSelectedMovie, setSelectedMovieId, fetchComparisonMovies]);

//   const handleFeedbackSubmit = useCallback(
//     async (pref: 'love' | 'like' | 'dislike') => {
//       setUserPreference({ preference: pref });
//       setFeedbackVisible(false);

//       const list = await fetchComparisonMovies(pref);
//       if (list.length > 0) {
//         setComparisonVisible(true);
//       } else if (selectedMovie?.imdb_id) {
//         try {
//           await calculateMovieRating(token, {
//             imdb_id: selectedMovie.imdb_id,
//             preference: pref,
//           });
//         } catch (error) {
//           console.error('calculateMovieRating (direct) error:', error);
//         }
//       }
//     },
//     [fetchComparisonMovies, selectedMovie, token]
//   );

//   const handleSkipSetFirst = async () => {
//     if (!selectedMovie || !secondMovieData || !userPreference.preference) return;

//     try {
//       console.log("⏭️ Skip pressed → showing next right-side movie", secondMovieData.title);
//       console.log("Last action:", lastAction);

//       // API call: treat as first movie won by default
//       // await recordUserPreferences(
//       //   token,
//       //   userPreference.preference,
//       //   selectedMovie.imdb_id,
//       //   secondMovieData.imdb_id,
//       //   selectedMovie.imdb_id
//       // );

//       // Decide whether to update high or low based on lastAction
//       if (lastAction === 'first') {
//         const newHigh = midRef.current - 1;
//         const newMid = Math.floor((lowRef.current + newHigh) / 2);
//         setHigh(newHigh);
//         highRef.current = newHigh;
//         setMid(newMid);
//         midRef.current = newMid;
//       } else if (lastAction === 'second') {
//         const newLow = midRef.current + 1;
//         const newMid = Math.floor((newLow + highRef.current) / 2);
//         setLow(newLow);
//         lowRef.current = newLow;
//         setMid(newMid);
//         midRef.current = newMid;
//       } else {
//         const newHigh = midRef.current - 1;
//         const newMid = Math.floor((lowRef.current + newHigh) / 2);
//         setHigh(newHigh);
//         highRef.current = newHigh;
//         setMid(newMid);
//         midRef.current = newMid;
//       }
//       console.log('skip__wortk__fulll', 'low--', lowRef.current, 'high---', highRef.current, '--', lastAction);
//       // Check if we are out of bounds → finalize rating
//       if (lowRef.current > highRef.current || !comparisonMovies[midRef.current]) {
//         console.log("✅_No_more_movies_→_closing modal after skip", 'low--', lowRef.current, 'high---', highRef.current);
//         setComparisonVisible(false);
//         setStepsModalVisible(true);

//         if (selectedMovie?.imdb_id && userPreference.preference) {
//           await calculateMovieRating(token, {
//             imdb_id: selectedMovie?.imdb_id,
//             preference: userPreference?.preference,
//           });
//         }
//         return;
//       }
//       // Otherwise → proceed with next comparison
//       setCurrentStep(s => s + 1);

//     } catch (err) {
//       console.error("❌ handleSkipSetFirst error:", err);
//     }
//   };


//   const handleSelectFirst = useCallback(async () => {
//     if (!selectedMovie || !secondMovieData || !userPreference.preference) return;

//     try {
//       // Record user preference
//       setLastAction('first');

//       await recordUserPreferences(
//         token,
//         userPreference.preference,
//         selectedMovie.imdb_id,
//         secondMovieData.imdb_id,
//         selectedMovie.imdb_id
//       );

//       // Update high and mid using refs (binary search logic)
//       const newHigh = midRef.current - 1;
//       const newMid = Math.floor((lowRef.current + newHigh) / 2);
//       setHigh(newHigh);
//       highRef.current = newHigh;
//       setMid(newMid);
//       midRef.current = newMid;

//       // Calculate remaining items
//       const remainingItems = highRef.current - lowRef.current + 1;

//       if (remainingItems <= 0) {

//         setComparisonVisible(false);
//         setStepsModalVisible(true);

//         if (selectedMovie?.imdb_id && userPreference.preference) {
//           dispatch(setModalClosed(true));
//           await calculateMovieRating(token, {
//             imdb_id: selectedMovie.imdb_id,
//             preference: userPreference.preference,
//           });
//         }
//         return;
//       }
//       if (remainingItems === 2) {
//         setMid(lowRef.current);
//         midRef.current = lowRef.current;
//       }

//     } catch (err) {
//       console.error("handleSelectFirst error:", err);
//     }
//   }, [selectedMovie, secondMovieData, token, userPreference.preference]);

//   const handleSelectSecond = useCallback(async () => {
//     if (!selectedMovie || !secondMovieData || !userPreference.preference) return;

//     try {
//       setLastAction('second');
//       await recordUserPreferences(
//         token,
//         userPreference.preference,
//         selectedMovie.imdb_id,
//         secondMovieData.imdb_id,
//         secondMovieData.imdb_id
//       );

//       // Update low and mid using refs
//       const newLow = midRef.current + 1;
//       const newMid = Math.floor((newLow + highRef.current) / 2);
//       setLow(newLow);
//       console.log(newLow , 'newLow', newMid , 'newMid', highRef.current , 'highRef___current')
//       lowRef.current = newLow;
//       setMid(newMid);
//       midRef.current = newMid;

//       // Check if out of bounds
//       // if (midRef.current >= highRef.current) {
//       //     console.log()

//       //   setComparisonVisible(false);
//       //   setStepsModalVisible(true);
//       // const remainingItems = highRef.current - lowRef.current + 1;

//       // if (remainingItems === 2) {
//       //   // force final comparison
//       //   setMid(lowRef.current); // first of the two
//       //   midRef.current = lowRef.current;
//       //   // don't close modal yet, wait for user choice
//       // } else if (midRef.current >= highRef.current) {
//       //   setComparisonVisible(false);
//       //   setStepsModalVisible(true);
//       //   if (selectedMovie?.imdb_id && userPreference.preference) {
//       //     await calculateMovieRating(token, {
//       //       imdb_id: selectedMovie.imdb_id,
//       //       preference: userPreference.preference,
//       //     });
//       //   }
//       //   return;
//       // }


//       const remainingItems = highRef.current - lowRef.current + 1;
//       console.log(highRef.current, lowRef.current + 1)

//       if (remainingItems <= 0) {
//         setComparisonVisible(false);
//         setStepsModalVisible(true);

//         if (selectedMovie?.imdb_id && userPreference.preference) {
//           // dispatch(setModalClosed(true));

//          const result_calculate_movie =  await calculateMovieRating(token, {
//             imdb_id: selectedMovie.imdb_id,
//             preference: userPreference.preference,
//           });

//           if(result_calculate_movie ) dispatch(setModalClosed(true));
//         }
//         return;
//       }
//     } catch (err) {
//       console.error("handleSelectSecond error:", err);
//     }
//   }, [selectedMovie, secondMovieData, token, userPreference.preference]);


//   const handleNextComparison = useCallback(
//     async (skip = false) => {
//       if (
//         selectionHistory.length >= 3 &&
//         selectionHistory[selectionHistory.length - 3] === "second" &&
//         selectionHistory[selectionHistory.length - 2] === "second" &&
//         selectionHistory[selectionHistory.length - 1] === "first"
//       ) {
//         // console.log("Pattern matched → Close modal");
//         setComparisonVisible(false);
//         setStepsModalVisible(true);
//         setSelectionHistory([]);
//         if (selectedMovie?.imdb_id && userPreference.preference) {

//           try {

//             await calculateMovieRating(token, {
//               imdb_id: selectedMovie.imdb_id,
//               preference: userPreference.preference,
//             });
//           } catch (error) {
//             console.error('calculateMovieRating (final) error:', error);
//           }
//         }
//         return;
//       }
//       const next = currentComparisonIndex + 1;

//       // if user skipped at the end
//       if (skip) {
//         setComparisonVisible(false);
//         // handleSkipSetFirst();

//         if (comparisonMovies.length < 6) setStepsModalVisible(true);
//         return;
//       }
//       if (next < comparisonMovies.length) {
//         setCurrentComparisonIndex(next);
//         setCurrentStep(s => s + 1); // functional update
//       } else {
//         // finished comparisons
//         setComparisonVisible(false);
//         setStepsModalVisible(true);
//         if (selectedMovie?.imdb_id && userPreference.preference) {
//           try {
//             await calculateMovieRating(token, {
//               imdb_id: selectedMovie.imdb_id,
//               preference: userPreference.preference,
//             });
//           } catch (error) {
//             console.error('calculateMovieRating (final) error:', error);
//           };
//         };
//       };
//     },
//     [comparisonMovies.length, currentComparisonIndex, selectedMovie, token, userPreference.preference]
//   );
//   // close modal and rollback last decisions
//   const [commentMdal, setCommentModal] = useState(false);
//   const handleCloseRating = async () => {
//     try {
//       await rollbackPairwiseDecisions(token, userPreference?.preference,);
//       console.log(userPreference.preference, selectedMovieId, "----selectedMovieId---")

//       setComparisonVisible(false);
//     } catch (error) {
//       console.error("Rollback failed", error);
//     }
//   };
//   // progress bar
//   //  ---- On mount (or token change) → load initial step count ----

//   //  const [currentStep, setCurrentStep] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const isFetchedRef = useRef(false); //  prevent multiple calls

//   useEffect(() => {
//     // agar token na ho to kuch mat kar
//     if (!token || isFetchedRef.current) return;

//     let mounted = true;
//     isFetchedRef.current = true; // ✅ ensures runs only once
// console.log('call___data')
//     const init = async () => {
//       try {
//         const storedCount = await AsyncStorage.getItem('currentStep');
//         const countNum = storedCount ? Number(storedCount) : 0;
//         console.log('Stored count:', countNum);

//         // ✅ skip API if already have 5 or more
//         if (countNum >= 5) {
//           if (mounted) {
//             setCurrentStep(countNum);
//             setLoading(false);
//           }
//           console.log('Skipping API — already rated 5+ movies');
//           return;
//         }

//         // ✅ else fetch API once
//         const resp = await getRatedMovies(token);
//         if (!mounted) return;

//         const totalRated = resp?.results?.length ?? 0;
//         setCurrentStep(totalRated);
//         console.log('Loaded totalRated:', totalRated);

//         await AsyncStorage.setItem('currentStep', String(totalRated));
//       } catch (e) {
//         console.error('Initial step load error:', e);
//       } finally {
//         if (mounted) setLoading(false);
//       }
//     };

//     init();

//     return () => {
//       mounted = false;
//     };
//   }, [token]);

//   // return { currentStep, loading };
// // };

// //   useEffect(() => {
// //     let mounted = true;
// //     (async () => {
// //       const setCount = await AsyncStorage.getItem('currentStep')
// //       console.log('setCount_____--data--count',setCount)
// //       if (setCount < 6) {
// //  try {

// //         const resp = await getRatedMovies(token);
// //         if (!mounted) return;
// //         const totalRated = resp?.results?.length ?? 0;
// //         setCurrentStep(totalRated);
// //         console.log(totalRated, "Initial step count loaded from RatedMovies");
// //         await AsyncStorage.setItem('currentStep', String(totalRated));
// //       } catch (e) {
// //         console.error('initial step load error:', e);
// //       }
// //       }

// //     })();
// //     return () => {
// //       mounted = false;
// //     };
// //   }, []);


//   // const handleSelectFirst = useCallback(async () => {
//   //   if (!selectedMovie || !secondMovieData || !userPreference.preference) return;

//   //   try {
//   //     // Record user preference
//   //     setLastAction('first');

//   //     await recordUserPreferences(
//   //       token,
//   //       userPreference.preference,
//   //       selectedMovie.imdb_id,
//   //       secondMovieData.imdb_id,
//   //       selectedMovie.imdb_id
//   //     );

//   //     // Update high and mid using refs
//   //     const newHigh = midRef.current - 1;
//   //     const newMid = Math.floor((lowRef.current + newHigh) / 2);
//   //     setHigh(newHigh);
//   //     highRef.current = newHigh;
//   //     setMid(newMid);
//   //     midRef.current = newMid;

//   //     // Check bounds after updating refs
//   //     if (lowRef.current > midRef.current) {
//   //       setComparisonVisible(false);
//   //       setStepsModalVisible(true);

//   //       if (selectedMovie?.imdb_id && userPreference.preference) {
//   //       dispatch(setModalClosed(true));

//   //         await calculateMovieRating(token, {
//   //           imdb_id: selectedMovie.imdb_id,
//   //           preference: userPreference.preference,
//   //         });
//   //       }
//   //       return;
//   //     }

//   //     // Optionally, other checks can be handled here if needed



//   //   } catch (err) {
//   //     console.error("handleSelectFirst error:", err);
//   //   }
//   // }, [selectedMovie, secondMovieData, token, userPreference.preference]);


//   return {
//     // State
//     selectedMovie,
//     selectedMovieId,
//     secondMovieData,               // derived
//     currentComparisonIndex,
//     comparisonMovies,
//     userPreference,
//     setUserPreference,             // still accepts { preference: ... }
//     stepsModal,
//     setStepsModal,
//     // Modals
//     isFeedbackVisible,
//     isComparisonVisible,
//     openFeedbackModal,
//     setFeedbackVisible,
//     setComparisonVisible,
//     // Actions
//     handleFeedbackSubmit,
//     handleSelectFirst,
//     handleSelectSecond,
//     handleNextComparison,
//     handleSkipSetFirst,
//     resetComparisonData,
//     // Step progressbar
//     isStepsModalVisible,
//     setStepsModalVisible,
//     currentStep,
//     setCurrentStep,
//     handleCloseRating,   // close modal by cross
//   };
// };


import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { calculateMovieRating, getAllRated_with_preference, getRatedMovies, recordPairwiseDecision, rollbackPairwiseDecisions } from '../../../../redux/Api/movieApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { setModalClosed } from '../../../../redux/feature/modalSlice/modalSlice';

export const useCompareComponent = (token: string) => {
  // ---- Core state ----
  const [selectedMovie, setSelectedMovie] = useState<any>(null);
  const [selectedMovieId, setSelectedMovieId] = useState<string | null>(null);

  const [comparisonMovies, setComparisonMovies] = useState<any[]>([]);
  const [currentComparisonIndex, setCurrentComparisonIndex] = useState(0);

  // Modal states (public API same)
  const [isFeedbackVisible, setFeedbackVisible] = useState(false);
  const [isComparisonVisible, setComparisonVisible] = useState(false);
  const [stepsModal, setStepsModal] = useState<boolean>(false); // kept for compatibility
  const [isStepsModalVisible, setStepsModalVisible] = useState(false);
  const dispatch = useDispatch();

  // Steps & preference
  const [currentStep, setCurrentStep] = useState(0);
  const [selectionHistory, setSelectionHistory] = useState<string[]>([]);
  const [userPreference, setUserPreference] = useState<{
    preference: 'love' | 'like' | 'dislike' | null;
  }>({ preference: null });

  // ---- Binary search bounds ----
  const [low, setLow] = useState(0);
  const [high, setHigh] = useState(0);
  const [mid, setMid] = useState(0);
  const [lastAction, setLastAction] = useState(null); // 'first' Or 'second'

  const lowRef = useRef(0);
  const highRef = useRef(0);
  const midRef = useRef(0);

  const fetchComparisonMovies = useCallback(async (pref?: 'love' | 'like' | 'dislike') => {
    const preferenceToUse = pref || userPreference.preference;
    if (!token || !selectedMovieId || !preferenceToUse) return [];

    try {
      let allResults: any[] = [];
      let currentPage = 1;
      let totalPages = 1;
      while (currentPage <= totalPages) {
        // const response = await getRatedMovies(token, currentPage);
        const response = await getAllRated_with_preference(token, preferenceToUse)
        const totalRated = response?.results?.length ?? 0;
        setCurrentStep(totalRated);
         await AsyncStorage.setItem('currentStep', String(totalRated));
        // console.log('getAllRated_with_preferenceTo_go_', response)
        totalPages = response?.total_pages ?? 1;
        currentPage = response?.current_page ?? currentPage;
        allResults = [...allResults, ...(response?.results ?? [])];
        currentPage += 1;
      }
      const filtered = allResults
        .filter(m => m.imdb_id !== selectedMovieId)
        .filter(m => m.preference === preferenceToUse)
      // .sort((a, b) => a.title.localeCompare(b.title));
      // console.log('work__properTOwork__', filtered)
      setComparisonMovies(filtered);

      // set binary search bounds
      const length = filtered.length;
      setLow(0);
      lowRef.current = 0;
      setHigh(length - 1);
      highRef.current = length - 1;
      setMid(Math.floor((length - 1) / 2)); // first pivot = median
      midRef.current = Math.floor((length - 1) / 2);

      return filtered;
    } catch (err) {
      console.error('fetchComparisonMovies error:', err);
      return [];
    }
  }, [token, selectedMovieId, userPreference.preference]);

  const secondMovieData = useMemo(() => {
    if (!comparisonMovies.length) return null;
    if (mid < 0 || mid >= comparisonMovies.length) return null;
    // console.log('comparision__data__hereTO_Pdd', comparisonMovies[mid])
    return comparisonMovies[mid];
  }, [comparisonMovies, mid]);

  const resetComparisonData = useCallback(() => {
    setComparisonMovies([]);
    setCurrentComparisonIndex(0);
  }, [isComparisonVisible, setComparisonVisible, setComparisonMovies, setCurrentComparisonIndex]);

  // ---- Open feedback modal ----
  const openFeedbackModal = useCallback((movie: any) => {
    // setSelectedMovie(movie);
    // setSelectedMovieId(movie?.imdb_id ?? null);
    // setFeedbackVisible(true);
    setSelectionHistory([]);
    setComparisonMovies([]);
    setCurrentComparisonIndex(0);
    setSelectedMovie(movie);
    setSelectedMovieId(movie?.imdb_id ?? null);
    setFeedbackVisible(true);
    fetchComparisonMovies();
    // }, [isFeedbackVisible, isComparisonVisible,]);
  }, [isFeedbackVisible, isComparisonVisible, setFeedbackVisible, setComparisonVisible, setSelectedMovie, setSelectedMovieId, fetchComparisonMovies]);

  const handleFeedbackSubmit = useCallback(
    async (pref: 'love' | 'like' | 'dislike') => {
      setUserPreference({ preference: pref });
      setFeedbackVisible(false);

      const list = await fetchComparisonMovies(pref);
      if (list.length > 0) {
        setComparisonVisible(true);
      } else if (selectedMovie?.imdb_id) {
        try {
          await calculateMovieRating(token, {
            imdb_id: selectedMovie.imdb_id,
            preference: pref,
          });
        } catch (error) {
          console.error('calculateMovieRating (direct) error:', error);
        }
      }
    },
    [fetchComparisonMovies, selectedMovie, token]
  );

  const handleSkipSetFirst = async () => {
          console.log("Last action:", lastAction);

    if (!selectedMovie || !secondMovieData || !userPreference.preference) return;

    try {
      console.log("⏭️ Skip pressed → showing next right-side movie", secondMovieData.title);
      console.log("Last action:", lastAction);

      // API call: treat as first movie won by default
      // await recordUserPreferences(
      //   token,
      //   userPreference.preference,
      //   selectedMovie.imdb_id,
      //   secondMovieData.imdb_id,
      //   selectedMovie.imdb_id
      // );

      // Decide whether to update high or low based on lastAction
      if (lastAction === 'first') {
        const newHigh = midRef.current - 1;
        const newMid = Math.floor((lowRef.current + newHigh) / 2);
        setHigh(newHigh);
        highRef.current = newHigh;
        setMid(newMid);
        midRef.current = newMid;
      } else if (lastAction === 'second') {
        const newLow = midRef.current + 1;
        const newMid = Math.floor((newLow + highRef.current) / 2);
        setLow(newLow);
        lowRef.current = newLow;
        setMid(newMid);
        midRef.current = newMid;
      } else {
        const newHigh = midRef.current - 1;
        const newMid = Math.floor((lowRef.current + newHigh) / 2);
        setHigh(newHigh);
        highRef.current = newHigh;
        setMid(newMid);
        midRef.current = newMid;
      }
      console.log("Skip api call,",lowRef)
      // console.log("highRef,",highRef)
      // console.log('skip__wortk__fulll', 'low--', lowRef.current, 'high---', highRef.current, '--', comparisonMovies[midRef.current]);
      // console.log('skip__wortk__fulll', 'low--', lowRef.current, 'high---', highRef.current, '--', lastAction);
      // Check if we are out of bounds → finalize rating
      // if (lowRef.current > highRef.current || !comparisonMovies[midRef.current]) {
      if (lowRef.current > highRef.current || !comparisonMovies[midRef.current]) {
        // console.log("✅ skip _\ modal after ", 'low--', lowRef.current, 'high---', highRef.current);
        setComparisonVisible(false);
        setStepsModalVisible(true);

        if (selectedMovie?.imdb_id && userPreference.preference) {
          await calculateMovieRating(token, {
            imdb_id: selectedMovie?.imdb_id,
            preference: userPreference?.preference,
          });
        }
        return;
      }
      // Otherwise → proceed with next comparison
      setCurrentStep(s => s + 1);

    } catch (err) {
      console.error("❌ handleSkipSetFirst error:", err);
    }
  };



  const handleSelectFirst = useCallback(async () => {
    if (!selectedMovie || !secondMovieData || !userPreference.preference) return;
// console.log("left side ------ ", selectedMovie.imdb_id)
console.log("left side ------ ", secondMovieData.title)
  // console.log("left selectedMovie --34455",selectedMovie)
     try {
      // Record user preference
      setLastAction('first');

      // await recordUserPreferences(
      //   token,
      //   userPreference.preference,
      //   selectedMovie.imdb_id,
      //   secondMovieData.imdb_id,
      //   selectedMovie.imdb_id
      // );
      await recordPairwiseDecision(
        token,
        {
          preference: userPreference.preference,
          imdb_id_1: selectedMovie.imdb_id,
          imdb_id_2: secondMovieData.imdb_id,
          winner:selectedMovie.imdb_id
          // winner: selectedMovie.imdb_id

        }

      );
 

      // Update high and mid using refs (binary search logic)
      const newHigh = midRef.current - 1;
      const newMid = Math.floor((lowRef.current + newHigh) / 2);
      setHigh(newHigh);
      highRef.current = newHigh;
      setMid(newMid);
      midRef.current = newMid;

      // Calculate remaining items
      const remainingItems = highRef.current - lowRef.current + 1;
 
      if (remainingItems <= 0) {

        setComparisonVisible(false);
        setStepsModalVisible(true);

        if (selectedMovie?.imdb_id && userPreference.preference) {
          dispatch(setModalClosed(true));
          await calculateMovieRating(token, {
            imdb_id: selectedMovie.imdb_id,
            preference: userPreference.preference,
          });
        }
        return;
      }
      if (remainingItems === 2) {
        setMid(lowRef.current);
        midRef.current = lowRef.current;
      }

    } catch (err) {
      console.error("handleSelectFirst error:", err);
    }
  }, [selectedMovie, secondMovieData, token, userPreference.preference]);


  const handleSelectSecond = useCallback(async () => {
    if (!selectedMovie || !secondMovieData || !userPreference.preference) return;
 console.log("right side  title  ------ ", selectedMovie.title)
//  console.log("right side ------ ", userPreference.preference)
//       console.log("right --34455",selectedMovie)
     try {
      setLastAction('second');

      // await recordUserPreferences(
      //   token,
      //   userPreference.preference,
      //   selectedMovie.imdb_id,
      //   secondMovieData.imdb_id,
      //   secondMovieData.imdb_id
      // );

       await recordPairwiseDecision(
        token,
        {
          preference: userPreference.preference,
          imdb_id_1: selectedMovie.imdb_id,
          imdb_id_2: secondMovieData.imdb_id,
          // winner: selectedMovie.imdb_id
          winner: secondMovieData.imdb_id

        }

      );
      console.log("second api call ",)

      // Update low and mid using refs
      const newLow = midRef.current + 1;
      const newMid = Math.floor((newLow + highRef.current) / 2);
      setLow(newLow);
      // console.log(newLow, 'newLow', newMid, 'newMid', highRef.current, 'highRef___current')
      lowRef.current = newLow;
      setMid(newMid);
      midRef.current = newMid;

      // Check if out of bounds
      // if (midRef.current >= highRef.current) {
      //     console.log()

      //   setComparisonVisible(false);
      //   setStepsModalVisible(true);
      // const remainingItems = highRef.current - lowRef.current + 1;

      // if (remainingItems === 2) {
      //   // force final comparison
      //   setMid(lowRef.current); // first of the two
      //   midRef.current = lowRef.current;
      //   // don't close modal yet, wait for user choice
      // } else if (midRef.current >= highRef.current) {
      //   setComparisonVisible(false);
      //   setStepsModalVisible(true);
      //   if (selectedMovie?.imdb_id && userPreference.preference) {
      //     await calculateMovieRating(token, {
      //       imdb_id: selectedMovie.imdb_id,
      //       preference: userPreference.preference,
      //     });
      //   }
      //   return;
      // }


      const remainingItems = highRef.current - lowRef.current + 1;
      console.log(highRef.current, lowRef.current + 1)

      if (remainingItems <= 0) {
        setComparisonVisible(false);
        setStepsModalVisible(true);

        if (selectedMovie?.imdb_id && userPreference.preference) {
          // dispatch(setModalClosed(true));

          const result_calculate_movie = await calculateMovieRating(token, {
            imdb_id: selectedMovie.imdb_id,
            preference: userPreference.preference,
          });
           if (result_calculate_movie) dispatch(setModalClosed(true));
        }
        return;
      }
    } catch (err) {
      console.error("handleSelectSecond error:", err);
    }
  }, [selectedMovie, secondMovieData, token, userPreference.preference]);


  const handleNextComparison = useCallback(
    async (skip = false) => {
      if (
        selectionHistory.length >= 3 &&
        selectionHistory[selectionHistory.length - 3] === "second" &&
        selectionHistory[selectionHistory.length - 2] === "second" &&
        selectionHistory[selectionHistory.length - 1] === "first"
      ) {
        // console.log("Pattern matched → Close modal");
        setComparisonVisible(false);
        setStepsModalVisible(true);
        setSelectionHistory([]);
        if (selectedMovie?.imdb_id && userPreference.preference) {

          try {

            await calculateMovieRating(token, {
              imdb_id: selectedMovie.imdb_id,
              preference: userPreference.preference,
            });
          } catch (error) {
            console.error('calculateMovieRating (final) error:', error);
          }
        }
        return;
      }
      const next = currentComparisonIndex + 1;

      // if user skipped at the end
      if (skip) {
        setComparisonVisible(false);
        // handleSkipSetFirst();

        if (comparisonMovies.length < 6) setStepsModalVisible(true);
        return;
      }
      if (next < comparisonMovies.length) {
        setCurrentComparisonIndex(next);
        setCurrentStep(s => s + 1); // functional update
      } else {
        // finished comparisons
        setComparisonVisible(false);
        setStepsModalVisible(true);
        if (selectedMovie?.imdb_id && userPreference.preference) {
          try {
            await calculateMovieRating(token, {
              imdb_id: selectedMovie.imdb_id,
              preference: userPreference.preference,
            });
          } catch (error) {
            console.error('calculateMovieRating (final) error:', error);
          };
        };
      };
    },
    [comparisonMovies.length, currentComparisonIndex, selectedMovie, token, userPreference.preference]
  );
  // close modal and rollback last decisions
  const [commentMdal, setCommentModal] = useState(false);
  const handleCloseRating = async () => {
    try {
      await rollbackPairwiseDecisions(token, userPreference?.preference,);
      console.log(userPreference.preference, selectedMovieId, "----selectedMovieId---")

      setComparisonVisible(false);
    } catch (error) {
      console.error("Rollback failed", error);
    }
  };
  // progress bar
  //  ---- On mount (or token change) → load initial step count ----

  //  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const isFetchedRef = useRef(false); //  prevent multiple calls

  useEffect(() => {
    // agar token na ho to kuch mat kar
    if (!token || isFetchedRef.current) return;

    let mounted = true;
    isFetchedRef.current = true; // ✅ ensures runs only once
    // console.log('call___data')
    const init = async () => {
      try {
        const storedCount = await AsyncStorage.getItem('currentStep');
        const countNum = storedCount ? Number(storedCount) : 0;
        // console.log('Stored count:', countNum);

        // ✅ skip API if already have 5 or more
        if (countNum >= 5) {
          if (mounted) {
            setCurrentStep(countNum);
            setLoading(false);
          }
           return;
        }

         const resp = await getRatedMovies(token);
        if (!mounted) return;

        const totalRated = resp?.results?.length ?? 0;
        setCurrentStep(totalRated);
        console.log('Loaded totalRated:', totalRated);

        await AsyncStorage.setItem('currentStep', String(totalRated));
      } catch (e) {
        console.error('Initial step load error:', e);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    init();

    return () => {
      mounted = false;
    };
  }, [token]);

  // return { currentStep, loading };
  // };

  //   useEffect(() => {
  //     let mounted = true;
  //     (async () => {
  //       const setCount = await AsyncStorage.getItem('currentStep')
  //       console.log('setCount_____--data--count',setCount)
  //       if (setCount < 6) {
  //  try {

  //         const resp = await getRatedMovies(token);
  //         if (!mounted) return;
  //         const totalRated = resp?.results?.length ?? 0;
  //         setCurrentStep(totalRated);
  //         console.log(totalRated, "Initial step count loaded from RatedMovies");
  //         await AsyncStorage.setItem('currentStep', String(totalRated));
  //       } catch (e) {
  //         console.error('initial step load error:', e);
  //       }
  //       }

  //     })();
  //     return () => {
  //       mounted = false;
  //     };
  //   }, []);


  // const handleSelectFirst = useCallback(async () => {
  //   if (!selectedMovie || !secondMovieData || !userPreference.preference) return;

  //   try {
  //     // Record user preference
  //     setLastAction('first');

  //     await recordUserPreferences(
  //       token,
  //       userPreference.preference,
  //       selectedMovie.imdb_id,
  //       secondMovieData.imdb_id,
  //       selectedMovie.imdb_id
  //     );

  //     // Update high and mid using refs
  //     const newHigh = midRef.current - 1;
  //     const newMid = Math.floor((lowRef.current + newHigh) / 2);
  //     setHigh(newHigh);
  //     highRef.current = newHigh;
  //     setMid(newMid);
  //     midRef.current = newMid;

  //     // Check bounds after updating refs
  //     if (lowRef.current > midRef.current) {
  //       setComparisonVisible(false);
  //       setStepsModalVisible(true);

  //       if (selectedMovie?.imdb_id && userPreference.preference) {
  //       dispatch(setModalClosed(true));

  //         await calculateMovieRating(token, {
  //           imdb_id: selectedMovie.imdb_id,
  //           preference: userPreference.preference,
  //         });
  //       }
  //       return;
  //     }

  //     // Optionally, other checks can be handled here if needed



  //   } catch (err) {
  //     console.error("handleSelectFirst error:", err);
  //   }
  // }, [selectedMovie, secondMovieData, token, userPreference.preference]);


  return {
    // State
    selectedMovie,
    selectedMovieId,
    secondMovieData,               // derived
    currentComparisonIndex,
    comparisonMovies,
    userPreference,
    setUserPreference,             // still accepts { preference: ... }
    stepsModal,
    setStepsModal,
    // Modals
    isFeedbackVisible,
    isComparisonVisible,
    openFeedbackModal,
    setFeedbackVisible,
    setComparisonVisible,
    // Actions
    handleFeedbackSubmit,
    handleSelectFirst,
    handleSelectSecond,
    handleNextComparison,
    handleSkipSetFirst,
    resetComparisonData,
    // Step progressbar
    isStepsModalVisible,
    setStepsModalVisible,
    currentStep,
    setCurrentStep,
    handleCloseRating,   // close modal by cross
  };
};
