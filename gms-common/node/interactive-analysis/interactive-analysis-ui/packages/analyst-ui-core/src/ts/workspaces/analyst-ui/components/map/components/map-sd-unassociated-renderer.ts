import { isSignalDetectionUnassociated } from '~analyst-ui/common/utils/signal-detection-util';
import { analystUiConfig, userPreferences } from '~analyst-ui/config';
import { EventTypes, SignalDetectionTypes } from '~graphql/';

declare var Cesium;

/**
 * Cesium DataSource with signal detections
 * 
 * @param dataSource source of signal detection data
 * @param signalDetections list of map signal detections
 * @param nextOpenEventId id of incoming open event
 */
export function draw(dataSource: any,
  signalDetections: SignalDetectionTypes.SignalDetection[],
  events: EventTypes.Event[], currentlyOpenEvent: EventTypes.Event) {
  addSignalDetections(dataSource, signalDetections, events, currentlyOpenEvent);
}

/**
 * Highlights the selected detection from either map/waveform viewer/list click
 * 
 * @param dataSource signal detection datasource
 * @param nextSelectedSignalDetection detections being selected
 */
export function highlightSelectedSignalDetections(
  dataSource: any,
  nextSelectedSignalDetection: string[],
) {
  const unSelectedWidth = analystUiConfig.userPreferences.map.widths.unselectedSignalDetection;
  const selectedWidth = analystUiConfig.userPreferences.map.widths.selectedSignalDetection;

  const signalDetectionEntities = dataSource.entities.values.map(entity => entity.id);
  const l = signalDetectionEntities.length;

  for (let i = 0; i < l; i++) {
    const sdID = signalDetectionEntities[i];
    const usd = dataSource.entities.getById(sdID);
    usd.polyline.width = unSelectedWidth;
  }

  nextSelectedSignalDetection.forEach(function (nsd) {
    const nextSignalDetection = dataSource.entities.
      getById(nsd);
    if (nextSignalDetection) {
      nextSignalDetection.polyline.width = selectedWidth;
    }
  });
}

/**
 * Resets by removing all signal detections when new interval is opened
 * 
 * @param dataSource signal detection datasource
 */
export function resetView(dataSource: any) {
  dataSource.entities.removeAll();
}

/**
 * Create new map entities for a list of signal detections
 * 
 * @param dataSource signal detection datasource
 * @param signalDetections detections to add
 * @param nextOpenEventId event that is being opened
 */
function addSignalDetections(
  dataSource: any,
  signalDetections: SignalDetectionTypes.SignalDetection[],
  events: EventTypes.Event[],
  currentlyOpenEvent: EventTypes.Event
  ) {

  resetView(dataSource);

  if (currentlyOpenEvent && signalDetections) {
    // Walk through each detection. If the signal detection is unassociated then
    // add it to the data source entities
    signalDetections.filter(sd => !sd.currentHypothesis.rejected)
    .forEach(signalDetection => {
      if (isSignalDetectionUnassociated(signalDetection, events)) {
        try {
          const openEventHyp = currentlyOpenEvent.currentEventHypothesis.eventHypothesis;
          const sigDetLat = signalDetection.station.location.latDegrees;
          const sigDetLon = signalDetection.station.location.lonDegrees;
          const sigDetAssocLat = openEventHyp.preferredLocationSolution.locationSolution.location.latitudeDegrees;
          const sigDetAssocLon = openEventHyp.preferredLocationSolution.locationSolution.location.longitudeDegrees;

          dataSource.entities.add({
            name: 'id: ' + signalDetection.id,
            polyline: {
              positions: Cesium.Cartesian3.fromDegreesArray([sigDetLon, sigDetLat,
                sigDetAssocLon, sigDetAssocLat]),
              width: analystUiConfig.userPreferences.map.widths.unselectedSignalDetection,
              material: Cesium.Color.fromCssColorString(userPreferences.colors.signalDetections.unassociated)
            },
            id: signalDetection.id,
            entityType: 'sd'
          });
        } catch (e) {
          // tslint:disable-next-line:no-console
          console.error('error: ', e.message);
        }
      }
    });
  }
}