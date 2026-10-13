import { useEffect, useState } from 'react';
import { api } from '../lib/api';

const working = status => status === 'PENDING' || status === 'RUNNING';
const measurementFor = scan => Array.isArray(scan?.scan_measurements) ? scan.scan_measurements[0] : scan?.scan_measurements;

export function useScanActivity(businessId, userId, apiClient = api) {
  const [record, setRecord] = useState(null);
  const [revision, setRevision] = useState(0);
  const [refreshSignal, setRefreshSignal] = useState(0);

  useEffect(() => {
    if (!businessId || !userId) return undefined;
    let active = true;
    let timer;
    let wasWorking = false;
    async function poll() {
      let delay = 30000;
      try {
        const result = await apiClient(`/businesses/${businessId}/scans`, { expectedUserId: userId });
        if (!active) return;
        const scan = (result.scans || []).find(item => working(item.status) || working(measurementFor(item)?.status)) || null;
        setRecord({ businessId, userId, scan });
        if (scan || wasWorking) setRevision(value => value + 1);
        wasWorking = Boolean(scan);
        if (scan) delay = 5000;
      } catch {
        // Each section shows its own read errors; this background status can retry quietly.
      }
      if (active) timer = setTimeout(poll, delay);
    }
    poll();
    return () => { active = false; clearTimeout(timer); };
  }, [businessId, userId, refreshSignal, apiClient]);

  return {
    scan: record?.businessId === businessId && record?.userId === userId ? record.scan : null,
    revision,
    refresh: () => setRefreshSignal(value => value + 1),
  };
}
