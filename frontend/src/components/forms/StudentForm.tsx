import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import apiService from '@/services/api';

interface Class {
  _id: string;
  classId: string;
  name: string;
}

interface StudentFormProps {
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
}

const StudentForm = ({ classes, onSuccess, onCancel }: StudentFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  
  console.log(classes);
  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    reset
  } = useForm<StudentFormInputs>({
    defaultValues: {
      studentId: '',
      name: '',
      email: '',
      classId: '',
      gender: '',
      phone: '',
      status: 'active'
    }
  });
  
  const onSubmit: SubmitHandler<StudentFormInputs> = async (data) => {
    setIsSubmitting(true);
    setFormError(null);
    setFormSuccess(null);
    
    try {
      const response = await apiService.students.create(data);
      
      if (response.success) {
        setFormSuccess('Student created successfully!');
        reset();
        
        // Notify parent component of success after a delay
        setTimeout(() => {
          onSuccess();
        }, 1500);
      } else {
        setFormError(response.message || response.error || 'Failed to create student');
      }
    } catch (err) {
      console.error('Error creating student:', err);
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
            {...register("studentId", { required: "Student ID is required" })}
            className={`w-full border ${errors.studentId ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            placeholder="e.g., S12345"
          />
          {errors.studentId && (
            <p className="mt-1 text-xs text-red-600">{errors.studentId.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name*</label>
          <input
            id="name"
            {...register("name", { required: "Full name is required" })}
            className={`w-full border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            placeholder="e.g., John Doe"
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
            {...register("email", { 
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address"
              }
            })}
            className={`w-full border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            placeholder="e.g., john.doe@example.com"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="classId" className="block text-sm font-medium text-gray-700 mb-1">Class*</label>
          <select
            id="classId"
            {...register("classId", { required: "Class is required" })}
            className={`w-full border ${errors.classId ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
          >
            <option value="">Select Class</option>
            {classes.map(cls => (
              <option key={cls._id} value={cls._id}>{cls.name}</option>
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
            {...register("gender", { required: "Gender is required" })}
            className={`w-full border ${errors.gender ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
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
            {...register("phone", { 
              required: "Phone number is required",
              pattern: {
                value: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
                message: "Invalid phone number format"
              }
            })}
            className={`w-full border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            placeholder="e.g., +1 234-567-8910"
          />
          {errors.phone && (
            <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            id="status"
            {...register("status")}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>
      
      <div className="flex justify-end space-x-3 border-t border-gray-200 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md flex items-center"
        >
          {isSubmitting ? (
            <>
              <div className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
              Saving...
            </>
          ) : (
            'Save Student'
          )}
        </button>
      </div>
    </form>
  );
};

export default StudentForm;
