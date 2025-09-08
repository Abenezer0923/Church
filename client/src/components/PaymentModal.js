import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import toast from 'react-hot-toast';
import { X } from 'lucide-react';

const PaymentModal = ({ member, onClose }) => {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm({
    defaultValues: {
      payment_month: new Date().getMonth() + 1,
      payment_year: new Date().getFullYear(),
      payment_date: new Date().toISOString().split('T')[0],
      payment_method: 'cash',
      tithe_amount: 0,
      offering_amount: 0,
      special_offering: 0
    }
  });

  const titheAmount = watch('tithe_amount') || 0;
  const offeringAmount = watch('offering_amount') || 0;
  const specialOffering = watch('special_offering') || 0;

  // Calculate total automatically
  const total = parseFloat(titheAmount) + parseFloat(offeringAmount) + parseFloat(specialOffering);

  React.useEffect(() => {
    setValue('total_amount', total);
  }, [total, setValue]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      
      await axios.post('/api/payments', {
        ...data,
        member_id: member.id,
        total_amount: total
      });
      
      toast.success('Payment recorded successfully');
      onClose();
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to record payment';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' }
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Record Payment for {member.first_name} {member.last_name}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Payment Month *
                  </label>
                  <select
                    {...register('payment_month', { required: 'Payment month is required' })}
                    className="input-field"
                  >
                    {months.map((month) => (
                      <option key={month.value} value={month.value}>
                        {month.label}
                      </option>
                    ))}
                  </select>
                  {errors.payment_month && (
                    <p className="mt-1 text-sm text-red-600">{errors.payment_month.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Payment Year *
                  </label>
                  <select
                    {...register('payment_year', { required: 'Payment year is required' })}
                    className="input-field"
                  >
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                  {errors.payment_year && (
                    <p className="mt-1 text-sm text-red-600">{errors.payment_year.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tithe Amount (ETB)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  {...register('tithe_amount')}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Offering Amount (ETB)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  {...register('offering_amount')}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Special Offering (ETB)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  {...register('special_offering')}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Total Amount (ETB) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={total}
                  readOnly
                  className="input-field bg-gray-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Payment Date *
                  </label>
                  <input
                    type="date"
                    {...register('payment_date', { required: 'Payment date is required' })}
                    className="input-field"
                  />
                  {errors.payment_date && (
                    <p className="mt-1 text-sm text-red-600">{errors.payment_date.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Payment Method
                  </label>
                  <select {...register('payment_method')} className="input-field">
                    <option value="cash">Cash</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="mobile_money">Mobile Money</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Notes
                </label>
                <textarea
                  {...register('notes')}
                  rows="3"
                  className="input-field"
                  placeholder="Any additional notes..."
                ></textarea>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || total <= 0}
                  className="btn-primary disabled:opacity-50"
                >
                  {loading ? 'Recording...' : 'Record Payment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;