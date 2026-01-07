import { useRef, useEffect, useCallback } from 'react';
import { recordTrailerInteraction } from '../redux/Api/movieApi';
import { formatSecondsToHMS } from '../redux/formatSecondsToHMS';


export const useTrailerTracker = (token: string) => {
  const trackingMapRef = useRef<
    Map<string, { startTime: number; endTime: number; trailer_url: string }>
  >(new Map());
  const currentImdbIdRef = useRef<string | null>(null);

  const onProgress = useCallback(({ currentTime, imdb_id, trailer_url }) => {
    if (!imdb_id || !trailer_url) return;

    if (!trackingMapRef.current.has(imdb_id)) {
      trackingMapRef.current.set(imdb_id, {
        startTime: currentTime,
        endTime: currentTime,
        trailer_url,
      });
    } else {
      const entry = trackingMapRef.current.get(imdb_id);
      if (entry) {
        entry.endTime = currentTime;
      }
    }

    currentImdbIdRef.current = imdb_id;

    // ✅ Store last valid info
    const entry = trackingMapRef.current.get(imdb_id);
    if (entry && entry.endTime > entry.startTime) {
      lastValidEntryRef.current = {
        imdb_id,
        trailer_url,
        startTime: entry.startTime,
        endTime: entry.endTime,
      };
    }

    // console.log('⏱ Tracking progress:', { imdb_id, ...trackingMapRef.current.get(imdb_id) });
  }, []);

  const lastValidEntryRef = useRef<{
    imdb_id: string;
    trailer_url: string;
    startTime: number;
    endTime: number;
  } | null>(null);
  // const triggerInteractionIfAny = async () => {
  //   const imdb_id = currentImdbIdRef.current;
  //   if (!imdb_id) return;

  //   const data = trackingMapRef.current.get(imdb_id);
  //   console.log(data ,'____ASDFGHJK')
  //   if (!data || data.endTime <= data.startTime) {
  //     console.log(`⚠️ Skipping log for ${imdb_id}: No meaningful watch`);
  //     return;
  //   }

  //   try {
  //     console.log('📡 Sending___trailer___interaction_for:', imdb_id, data);

  //     await recordTrailerInteraction(token, {
  //       imdb_id,
  //       trailer_url: data.trailer_url,
  //       start_at: formatSecondsToHMS(data.startTime),
  //       end_at: formatSecondsToHMS(data.endTime),
  //     });

  //     trackingMapRef.current.delete(imdb_id);
  //     currentImdbIdRef.current = null;
  //   } catch (err) {
  //     console.error('❌ Error sending interaction:', err);
  //   }
  // };
// Just inside triggerInteractionIfAny()

// console.log("🚨 TOKEN:", token);
  const triggerInteractionIfAny = async () => {
    // console.log('chai_piwanba'  ,  "last.endTime")
    const last = lastValidEntryRef.current;
    // console.log(last, "last ", last.endTime, "last.endTime", last.startTime, "last.startTime")
    if (!last || last.endTime <= last.startTime) {
      // console.log(`⚠️ Skipping interaction: no meaningful watch`);
      return;
    }
    // console.log('📡 1____1________1____1____:', last.imdb_id, last);

    try {
      // console.log('📡 Sending trailer interaction__for:', last.imdb_id, last);
      await recordTrailerInteraction(token, {
        imdb_id: last.imdb_id,
        trailer_url: last.trailer_url,
        start_at: formatSecondsToHMS(last.startTime),
        end_at: formatSecondsToHMS(last.endTime),
      });
    } catch (err) {
      console.error('❌ Error sending trailer interaction:', err);
    }

    // ✅ Don't reset lastValidEntryRef here — let it be reused if needed
  };

  const resetTracker = () => {
    trackingMapRef.current.clear();
    currentImdbIdRef.current = null;
  };

  return {
    onProgress,
    triggerInteractionIfAny,
    resetTracker,
  };
};
