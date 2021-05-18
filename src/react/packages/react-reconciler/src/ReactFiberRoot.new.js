/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import type {FiberRoot, SuspenseHydrationCallbacks} from './ReactInternalTypes';
import type {RootTag} from './ReactRootTags';

import {noTimeout, supportsHydration} from './ReactFiberHostConfig';
import {createHostRootFiber} from './ReactFiber.new';
import {
  NoLane,
  NoLanes,
  NoTimestamp,
  createLaneMap,
} from './ReactFiberLane.new';
import {
  enableSchedulerTracing,
  enableSuspenseCallback,
  enableCache,
  enableProfilerCommitHooks,
  enableProfilerTimer,
} from 'shared/ReactFeatureFlags';
import {unstable_getThreadID} from 'scheduler/tracing';
import {initializeUpdateQueue} from './ReactUpdateQueue.new';
import {LegacyRoot, ConcurrentRoot} from './ReactRootTags';

// 
function FiberRootNode(containerInfo, tag, hydrate) {
  this.tag = tag;
  // root 结点：render 的第二个参数
  this.containerInfo = containerInfo;
  // 只在持久化更新中会用到,不支持增量更新的平台，react-dom 不会用到
  this.pendingChildren = null;
  // 当前应用对应的 Fiber 对象，是 Root Fiber
  this.current = null;
  this.pingCache = null;
  this.finishedWork = null;
  this.timeoutHandle = noTimeout;
  this.context = null;
  this.pendingContext = null;
  // 第一次渲染时，是否需要融合
  this.hydrate = hydrate;
  this.callbackNode = null;
  this.callbackPriority = NoLane;
  this.eventTimes = createLaneMap(NoLanes);
  this.expirationTimes = createLaneMap(NoTimestamp);

  this.pendingLanes = NoLanes;
  this.suspendedLanes = NoLanes;
  this.pingedLanes = NoLanes;
  this.mutableReadLanes = NoLanes;
  this.finishedLanes = NoLanes;

  this.entangledLanes = NoLanes;
  this.entanglements = createLaneMap(NoLanes);

  if (enableCache) {
    this.pooledCache = null;
    this.pooledCacheLanes = NoLanes;
  }

  if (supportsHydration) {
    this.mutableSourceEagerHydrationData = null;
  }

  if (enableSchedulerTracing) {
    this.interactionThreadID = unstable_getThreadID();
    this.memoizedInteractions = new Set();
    this.pendingInteractionMap = new Map();
  }
  if (enableSuspenseCallback) {
    this.hydrationCallbacks = null;
  }

  if (enableProfilerTimer && enableProfilerCommitHooks) {
    this.effectDuration = 0;
    this.passiveEffectDuration = 0;
  }

  if (__DEV__) {
    switch (tag) {
      case ConcurrentRoot:
        this._debugRootType = 'createRoot()';
        break;
      case LegacyRoot:
        this._debugRootType = 'createLegacyRoot()';
        break;
    }
  }
}

export function createFiberRoot(
  containerInfo: any,
  tag: RootTag,
  hydrate: boolean,
  hydrationCallbacks: null | SuspenseHydrationCallbacks,
  strictModeLevelOverride: null | number,
): FiberRoot {
  const root: FiberRoot = (new FiberRootNode(containerInfo, tag, hydrate): any);
  if (enableSuspenseCallback) {
    root.hydrationCallbacks = hydrationCallbacks;
  }

  // Cyclic construction. This cheats the type system right now because
  // stateNode is any.
  const uninitializedFiber = createHostRootFiber(tag, strictModeLevelOverride);
  // 指向 Fiber
  root.current = uninitializedFiber;
  uninitializedFiber.stateNode = root;

  if (enableCache) {
    const initialCache = new Map();
    root.pooledCache = initialCache;
    const initialState = {
      element: null,
      cache: initialCache,
    };
    uninitializedFiber.memoizedState = initialState;
  } else {
    const initialState = {
      element: null,
    };
    uninitializedFiber.memoizedState = initialState;
  }

  initializeUpdateQueue(uninitializedFiber);

  return root;
}
