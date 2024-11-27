import Container from 'components/layout/Container';
import MainLayout from 'components/layout/MainLayout';
import DowntimeReport from './component/downtimeReport';

export type DowntimeType = 'Maintenance' | 'Production';

export interface DowntimeEntry {
  originalType: DowntimeType; // Type of downtime
  start: string; // ISO 8601 format for easier manipulation
  end: string; // ISO 8601 format for easier manipulation
}

export interface Ticket {
  workOrder: string; // Work order ID or name
  asset: string; // Asset name or ID
  downtimeReason: string; // Reason for downtime
  downtimes: DowntimeEntry[]; // List of downtimes for this ticket
}

type DowntimeReport = Ticket[]; // Array of tickets for the report

export default function page() {
  const downtimeReport: DowntimeReport = [
    {
      workOrder: 'X001',
      asset: 'Envasadora',
      downtimeReason: 'Motiu X',
      downtimes: [
        {
          originalType: 'Maintenance',
          start: '2024-11-26T14:45:00',
          end: '2024-11-26T15:00:00',
        },
        {
          originalType: 'Production',
          start: '2024-11-26T14:50:00',
          end: '2024-11-26T14:55:00',
        },
      ],
    },
    {
      workOrder: 'X002',
      asset: 'Packaging Machine',
      downtimeReason: 'Problema Sensor',
      downtimes: [
        {
          originalType: 'Maintenance',
          start: '2024-11-26T10:00:00',
          end: '2024-11-26T10:30:00',
        },
      ],
    },
    {
      workOrder: 'X003',
      asset: 'Mixer',
      downtimeReason: 'Overheating',
      downtimes: [
        {
          originalType: 'Production',
          start: '2024-11-25T08:15:00',
          end: '2024-11-25T08:45:00',
        },
        {
          originalType: 'Maintenance',
          start: '2024-11-25T09:00:00',
          end: '2024-11-25T09:30:00',
        },
      ],
    },
    {
      workOrder: 'X004',
      asset: 'Conveyor Belt',
      downtimeReason: 'Misalignment',
      downtimes: [
        {
          originalType: 'Maintenance',
          start: '2024-11-25T11:00:00',
          end: '2024-11-25T11:20:00',
        },
        {
          originalType: 'Production',
          start: '2024-11-25T11:15:00',
          end: '2024-11-25T11:25:00',
        },
      ],
    },
    {
      workOrder: 'X005',
      asset: 'Filler Machine',
      downtimeReason: 'Material Jam',
      downtimes: [
        {
          originalType: 'Production',
          start: '2024-11-24T14:00:00',
          end: '2024-11-24T14:15:00',
        },
        {
          originalType: 'Maintenance',
          start: '2024-11-24T14:20:00',
          end: '2024-11-24T14:40:00',
        },
      ],
    },
    {
      workOrder: 'X006',
      asset: 'Capper',
      downtimeReason: 'Seal Malfunction',
      downtimes: [
        {
          originalType: 'Maintenance',
          start: '2024-11-23T10:00:00',
          end: '2024-11-23T10:45:00',
        },
      ],
    },
    {
      workOrder: 'X007',
      asset: 'Labeller',
      downtimeReason: 'Label Misprint',
      downtimes: [
        {
          originalType: 'Production',
          start: '2024-11-22T13:30:00',
          end: '2024-11-22T13:45:00',
        },
        {
          originalType: 'Maintenance',
          start: '2024-11-22T14:00:00',
          end: '2024-11-22T14:20:00',
        },
      ],
    },
    {
      workOrder: 'X009',
      asset: 'Labeller',
      downtimeReason: 'Label Misprint V2',
      downtimes: [
        {
          originalType: 'Production',
          start: '2024-11-23T13:30:00',
          end: '2024-11-23T13:45:00',
        },
        {
          originalType: 'Maintenance',
          start: '2024-11-23T14:00:00',
          end: '2024-11-23T14:20:00',
        },
      ],
    },
    {
      workOrder: 'X008',
      asset: 'Wrapper',
      downtimeReason: 'Film Tear',
      downtimes: [
        {
          originalType: 'Maintenance',
          start: '2024-11-21T15:00:00',
          end: '2024-11-21T15:30:00',
        },
      ],
    },
    {
      workOrder: 'X008',
      asset: 'Wrapper',
      downtimeReason: 'Film Tear',
      downtimes: [
        {
          originalType: 'Production',
          start: '2024-11-21T16:00:00',
          end: '2024-11-21T16:30:00',
        },
      ],
    },
  ];

  return (
    <MainLayout>
      <Container>
        <DowntimeReport tickets={downtimeReport} />
      </Container>
    </MainLayout>
  );
}
