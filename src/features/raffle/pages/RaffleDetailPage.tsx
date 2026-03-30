import { useNavigate, useParams } from 'react-router-dom'
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Typography,
} from '@mui/material'
import { ArrowBack, Edit, Delete } from '@mui/icons-material'
import { PageHeader, StatusChip, LoadingSkeleton, ConfirmDialog, QueryErrorState } from '@shared/components'
import { useConfirmDialog } from '@shared/hooks'
import { formatDate, formatDateTime } from '@shared/utils'
import { useRaffle, useDeleteRaffle } from '../api/raffle.queries'
import { RAFFLE_ROUTES } from '../constants/routes'

export function RaffleDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: raffle, isLoading, isError, error, refetch } = useRaffle(id!)
  const deleteMutation = useDeleteRaffle()
  const { open, openDialog, closeDialog, confirm } = useConfirmDialog()

  const handleDelete = () => {
    openDialog(() =>
      deleteMutation.mutate(id!, {
        onSuccess: () => navigate(RAFFLE_ROUTES.LIST),
      }),
    )
  }

  if (isLoading) {
    return (
      <>
        <PageHeader title="Raffle Details" />
        <LoadingSkeleton rows={8} />
      </>
    )
  }

  if (isError) {
    return (
      <>
        <PageHeader title="Raffle Details" />
        <QueryErrorState message={error?.message} onRetry={() => refetch()} />
      </>
    )
  }

  if (!raffle) {
    return <Typography>Raffle not found</Typography>
  }

  return (
    <>
      <PageHeader
        title={raffle.name}
        action={
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={() => navigate(RAFFLE_ROUTES.LIST)}
            >
              Back to List
            </Button>
            <Button
              variant="contained"
              startIcon={<Edit />}
              onClick={() => navigate(RAFFLE_ROUTES.EDIT.replace(':id', id!))}
            >
              Edit
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<Delete />}
              onClick={handleDelete}
            >
              Delete
            </Button>
          </Box>
        }
      />

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    Description
                  </Typography>
                  <Typography>{raffle.description}</Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="body2" color="text.secondary">
                    Status
                  </Typography>
                  <Box sx={{ mt: 0.5 }}>
                    <StatusChip status={raffle.status} />
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="body2" color="text.secondary">
                    Ticket Price
                  </Typography>
                  <Typography>
                    {raffle.ticketPrice === 0 ? 'Free' : raffle.ticketPrice.toLocaleString()}
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="body2" color="text.secondary">
                    Max Tickets/User
                  </Typography>
                  <Typography>{raffle.maxTicketsPerUser}</Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="body2" color="text.secondary">
                    Total Ticket Limit
                  </Typography>
                  <Typography>
                    {raffle.totalTicketLimit?.toLocaleString() ?? 'Unlimited'}
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={4}>
                  <Typography variant="body2" color="text.secondary">
                    Start Date
                  </Typography>
                  <Typography>{formatDate(raffle.startDate)}</Typography>
                </Grid>
                <Grid item xs={6} sm={4}>
                  <Typography variant="body2" color="text.secondary">
                    End Date
                  </Typography>
                  <Typography>{formatDate(raffle.endDate)}</Typography>
                </Grid>
                <Grid item xs={6} sm={4}>
                  <Typography variant="body2" color="text.secondary">
                    Draw Date
                  </Typography>
                  <Typography>{formatDate(raffle.drawDate)}</Typography>
                </Grid>
                <Grid item xs={6} sm={4}>
                  <Typography variant="body2" color="text.secondary">
                    ID
                  </Typography>
                  <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                    {raffle.id}
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={4}>
                  <Typography variant="body2" color="text.secondary">
                    Created
                  </Typography>
                  <Typography>{formatDateTime(raffle.createdAt)}</Typography>
                </Grid>
                <Grid item xs={6} sm={4}>
                  <Typography variant="body2" color="text.secondary">
                    Updated
                  </Typography>
                  <Typography>{formatDateTime(raffle.updatedAt)}</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Typography variant="h6" gutterBottom>
            Prizes ({raffle.prizes.length})
          </Typography>
          {raffle.prizes.length === 0 ? (
            <Typography color="text.secondary">No prizes configured</Typography>
          ) : (
            <Grid container spacing={2}>
              {raffle.prizes.map((prize, index) => (
                <Grid item xs={12} key={prize.id ?? index}>
                  <Card variant="outlined">
                    <CardContent>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          mb: 1,
                        }}
                      >
                        <Typography variant="subtitle1" fontWeight={600}>
                          {prize.name}
                        </Typography>
                        <Chip label={prize.type} size="small" variant="outlined" />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        Amount: {prize.amount.toLocaleString()} &middot; Quantity: {prize.quantity}
                      </Typography>
                      {prize.imageUrl && (
                        <Typography variant="caption" color="text.secondary" noWrap>
                          {prize.imageUrl}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Grid>
      </Grid>

      <ConfirmDialog
        open={open}
        title="Delete Raffle"
        message="Are you sure you want to delete this raffle? This action cannot be undone."
        onConfirm={confirm}
        onCancel={closeDialog}
      />
    </>
  )
}
