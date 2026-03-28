import { useNavigate, useParams } from 'react-router-dom'
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from '@mui/material'
import { ArrowBack, Edit, Delete } from '@mui/icons-material'
import { PageHeader, StatusChip, LoadingSkeleton, ConfirmDialog } from '@shared/components'
import { useConfirmDialog } from '@shared/hooks'
import { useLeaderboard, useDeleteLeaderboard } from '../api/leaderboard.queries'
import { LEADERBOARD_ROUTES } from '../constants/routes'

export function LeaderboardDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: leaderboard, isLoading } = useLeaderboard(id!)
  const deleteMutation = useDeleteLeaderboard()
  const { open, openDialog, closeDialog, confirm } = useConfirmDialog()

  const handleDelete = () => {
    openDialog(() =>
      deleteMutation.mutate(id!, {
        onSuccess: () => navigate(LEADERBOARD_ROUTES.LIST),
      }),
    )
  }

  if (isLoading) {
    return (
      <>
        <PageHeader title="Leaderboard Details" />
        <LoadingSkeleton rows={8} />
      </>
    )
  }

  if (!leaderboard) {
    return <Typography>Leaderboard not found</Typography>
  }

  return (
    <>
      <PageHeader
        title={leaderboard.title}
        action={
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={() => navigate(LEADERBOARD_ROUTES.LIST)}
            >
              Back to List
            </Button>
            <Button
              variant="contained"
              startIcon={<Edit />}
              onClick={() => navigate(`/leaderboards/${id}/edit`)}
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
                  <Typography>{leaderboard.description}</Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="body2" color="text.secondary">
                    Status
                  </Typography>
                  <Box sx={{ mt: 0.5 }}>
                    <StatusChip status={leaderboard.status} />
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="body2" color="text.secondary">
                    Scoring Type
                  </Typography>
                  <Chip label={leaderboard.scoringType} size="small" sx={{ mt: 0.5 }} />
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="body2" color="text.secondary">
                    Max Participants
                  </Typography>
                  <Typography>{leaderboard.maxParticipants}</Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="body2" color="text.secondary">
                    ID
                  </Typography>
                  <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                    {leaderboard.id}
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="body2" color="text.secondary">
                    Start Date
                  </Typography>
                  <Typography>{new Date(leaderboard.startDate).toLocaleDateString()}</Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="body2" color="text.secondary">
                    End Date
                  </Typography>
                  <Typography>{new Date(leaderboard.endDate).toLocaleDateString()}</Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="body2" color="text.secondary">
                    Created
                  </Typography>
                  <Typography>{new Date(leaderboard.createdAt).toLocaleString()}</Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="body2" color="text.secondary">
                    Updated
                  </Typography>
                  <Typography>{new Date(leaderboard.updatedAt).toLocaleString()}</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Prizes ({leaderboard.prizes.length})
              </Typography>
              {leaderboard.prizes.length === 0 ? (
                <Typography color="text.secondary">No prizes configured</Typography>
              ) : (
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Rank</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell align="right">Amount</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {leaderboard.prizes.map((prize, index) => (
                        <TableRow key={prize.id ?? index}>
                          <TableCell>#{prize.rank}</TableCell>
                          <TableCell>{prize.name}</TableCell>
                          <TableCell>
                            <Chip label={prize.type} size="small" variant="outlined" />
                          </TableCell>
                          <TableCell align="right">
                            {prize.amount.toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <ConfirmDialog
        open={open}
        title="Delete Leaderboard"
        message="Are you sure you want to delete this leaderboard? This action cannot be undone."
        onConfirm={confirm}
        onCancel={closeDialog}
      />
    </>
  )
}
