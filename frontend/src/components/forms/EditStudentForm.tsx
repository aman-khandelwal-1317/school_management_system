import { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import apiService from '@/services/api';

interface Class {
  _id: string;
  classId: string;
  name: string;
}

interface Student {
  _id: string;
  studentId: string;
  name: string;
  email: string;
  class: Class | string;
  gender: string;
  phone: string;
  status: string;
  fatherName?: string;
  motherName?: string;
  address?: string;
}

interface EditStudentFormProps {
  student: Student;
  classes: Class[];
  onSuccess: () => void;
  onCancel: () => void;
}

interface StudentFormInputs {
  studentId: string;
  name: string;
  email: string;
  classId: string;
  gender: string;
  phone: string;
  status: string;
  fatherName: string;
  motherName: string;
  address: string;
}

const EditStudentForm = ({ student, classes, onSuccess, onCancel }: EditStudentFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    reset,
    setValue
  } = useForm<StudentFormInputs>();

  // Set form values when student prop changes
  useEffect(() => {
    if (student) {
      setValue('studentId', student.studentId);
      setValue('name', student.name);
      setValue('email', student.email);
      setValue('classId', typeof student.class === 'string' ? student.class : student.class._id);
      setValue('gender', student.gender);
      setValue('phone', student.phone);
      setValue('status', student.status);
      setValue('fatherName', student.fatherName || '');
      setValue('motherName', student.motherName || '');
      setValue('address', student.address || '');
    }
  }, [student, setValue]);
  
  const onSubmit: SubmitHandler<StudentFormInputs> = async (data) => {
    setIsSubmitting(true);
    setFormError(null);
    setFormSuccess(null);
    
    try {
      const response = await apiService.students.update(student._id, data);
      
      if (response.success) {
        setFormSuccess('Student updated successfully!');
        
        // Notify parent component of success after a delay
        setTimeout(() => {
          onSuccess();
        }, 1500);
      } else {
        setFormError(response.message || response.error || 'Failed to update student');
      }
    } catch (err) {
      console.error('Error updating student:', err);
      setFormError('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-4">
      {formError && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {formError}
        </div>
      )}
      
      {formSuccess && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
          {formSuccess}
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 mb-1">Student ID*</label>
          <input
            id="studentId"
            disabled
            className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 cursor-not-allowed"
            {...register('studentId', { required: 'Student ID is required' })}
          />
          {errors.studentId && (
            <p className="mt-1 text-xs text-red-600">{errors.studentId.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name*</label>
          <input
            id="name"
            className={`w-full border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            {...register('name', { required: 'Full name is required' })}
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email*</label>
          <input
            id="email"
            type="email"
            className={`w-full border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            {...register('email', { 
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            })}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="classId" className="block text-sm font-medium text-gray-700 mb-1">Class*</label>
          <select
            id="classId"
            className={`w-full border ${errors.classId ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            {...register('classId', { required: 'Class is required' })}
          >
            <option value="">Select Class</option>
            {classes.map((cls) => (
              <option key={cls._id} value={cls._id}>
                {cls.name}
              </option>
            ))}
          </select>
          {errors.classId && (
            <p className="mt-1 text-xs text-red-600">{errors.classId.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">Gender*</label>
          <select
            id="gender"
            className={`w-full border ${errors.gender ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            {...register('gender', { required: 'Gender is required' })}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          {errors.gender && (
            <p className="mt-1 text-xs text-red-600">{errors.gender.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number*</label>
          <input
            id="phone"
            type="tel"
            className={`w-full border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            {...register('phone', { 
              required: 'Phone number is required',
              pattern: {
                value: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
                message: 'Invalid phone number format'
              }
            })}
          />
          {errors.phone && (
            <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="fatherName" className="block text-sm font-medium text-gray-700 mb-1">Father's Name*</label>
          <input
            id="fatherName"
            className={`w-full border ${errors.fatherName ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            {...register('fatherName', { required: "Father's name is required" })}
          />
          {errors.fatherName && (
            <p className="mt-1 text-xs text-red-600">{errors.fatherName.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="motherName" className="block text-sm font-medium text-gray-700 mb-1">Mother's Name*</label>
          <input
            id="motherName"
            className={`w-full border ${errors.motherName ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            {...register('motherName', { required: "Mother's name is required" })}
          />
          {errors.motherName && (
            <p className="mt-1 text-xs text-red-600">{errors.motherName.message}</p>
          )}
        </div>
        
        <div className="col-span-2">
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address*</label>
          <textarea
            id="address"
            rows={3}
            className={`w-full border ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            {...register('address', { required: 'Address is required' })}
          />
          {errors.address && (
            <p className="mt-1 text-xs text-red-600">{errors.address.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            id="status"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            {...register('status')}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>
      
      <div className="flex justify-end space-x-3 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Updating...' : 'Update Student'}
        </button>
      </div>
    </form>
  );
};

export default EditStudentForm;
