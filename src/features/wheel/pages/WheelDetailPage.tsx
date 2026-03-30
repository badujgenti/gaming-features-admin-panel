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
import { PageHeader, StatusChip, LoadingSkeleton, ConfirmDialog, QueryErrorState } from '@shared/components'
import { useConfirmDialog } from '@shared/hooks'
import { formatDateTime } from '@shared/utils'
import { useWheel, useDeleteWheel } from '../api/wheel.queries'
import { WHEEL_ROUTES } from '../constants/routes'
import { AnimatedWheelPreview } from '../components/AnimatedWheelPreview'

export function WheelDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: wheel, isLoading, isError, error, refetch } = useWheel(id!)
  const deleteMutation = useDeleteWheel()
  const { open, openDialog, closeDialog, confirm } = useConfirmDialog()

  const handleDelete = () => {
    openDialog(() =>
      deleteMutation.mutate(id!, {
        onSuccess: () => navigate(WHEEL_ROUTES.LIST),
      }),
    )
  }

  if (isLoading) {
    return (
      <>
        <PageHeader title="Wheel Details" />
        <LoadingSkeleton rows={8} />
      </>
    )
  }

  if (isError) {
    return (
      <>
        <PageHeader title="Wheel Details" />
        <QueryErrorState message={error?.message} onRetry={() => refetch()} />
      </>
    )
  }

  if (!wheel) {
    return <Typography>Wheel not found</Typography>
  }

  return (
    <>
      <PageHeader
        title={wheel.name}
        action={
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={() => navigate(WHEEL_ROUTES.LIST)}
            >
              Back to List
            </Button>
            <Button
              variant="contained"
              startIcon={<Edit />}
              onClick={() => navigate(WHEEL_ROUTES.EDIT.replace(':id', id!))}
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
        <Grid item xs={12} md={4}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <AnimatedWheelPreview segments={wheel.segments} size={300} />
          </Box>
        </Grid>

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
                  <Typography>{wheel.description}</Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="body2" color="text.secondary">
                    Status
                  </Typography>
                  <Box sx={{ mt: 0.5 }}>
                    <StatusChip status={wheel.status} />
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="body2" color="text.secondary">
                    Spin Cost
                  </Typography>
                  <Typography>
                    {wheel.spinCost === 0 ? 'Free' : wheel.spinCost.toLocaleString()}
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="body2" color="text.secondary">
                    Max Spins/User
                  </Typography>
                  <Typography>{wheel.maxSpinsPerUser}</Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="body2" color="text.secondary">
                    Segments
                  </Typography>
                  <Typography>{wheel.segments.length}</Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="body2" color="text.secondary">
                    Background
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                    <Box
                      sx={{
                        width: 20,
                        height: 20,
                        borderRadius: 0.5,
                        bgcolor: wheel.backgroundColor,
                        border: '1px solid',
                        borderColor: 'divider',
                      }}
                    />
                    <Typography variant="body2">{wheel.backgroundColor}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="body2" color="text.secondary">
                    Border
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                    <Box
                      sx={{
                        width: 20,
                        height: 20,
                        borderRadius: 0.5,
                        bgcolor: wheel.borderColor,
                        border: '1px solid',
                        borderColor: 'divider',
                      }}
                    />
                    <Typography variant="body2">{wheel.borderColor}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="body2" color="text.secondary">
                    Created
                  </Typography>
                  <Typography>{formatDateTime(wheel.createdAt)}</Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="body2" color="text.secondary">
                    Updated
                  </Typography>
                  <Typography>{formatDateTime(wheel.updatedAt)}</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Segments ({wheel.segments.length})
          </Typography>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell width={50}>Color</TableCell>
                  <TableCell>Label</TableCell>
                  <TableCell>Prize Type</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell align="right">Weight</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {wheel.segments.map((seg, index) => (
                  <TableRow key={seg.id ?? index}>
                    <TableCell>
                      <Box
                        sx={{
                          width: 24,
                          height: 24,
                          borderRadius: 0.5,
                          bgcolor: seg.color,
                          border: '1px solid',
                          borderColor: 'divider',
                        }}
                      />
                    </TableCell>
                    <TableCell>{seg.label}</TableCell>
                    <TableCell>
                      <Chip label={seg.prizeType} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell align="right">
                      {seg.prizeType === 'nothing' ? '-' : seg.prizeAmount.toLocaleString()}
                    </TableCell>
                    <TableCell align="right">{seg.weight}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

      <ConfirmDialog
        open={open}
        title="Delete Wheel"
        message="Are you sure you want to delete this wheel? This action cannot be undone."
        onConfirm={confirm}
        onCancel={closeDialog}
      />
    </>
  )
}
