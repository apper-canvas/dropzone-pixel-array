const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

export const uploadService = {
  getAll: async () => {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "size_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "progress_c"}},
          {"field": {"Name": "uploaded_at_c"}},
          {"field": {"Name": "url_c"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        orderBy: [{"fieldName": "uploaded_at_c", "sorttype": "DESC"}],
        pagingInfo: {"limit": 50, "offset": 0}
      };
      
      const response = await apperClient.fetchRecords('upload_c', params);
      
      if (!response.success) {
        console.error("Failed to fetch uploads:", response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching uploads:", error?.response?.data?.message || error);
      return [];
    }
  },

  getById: async (id) => {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "size_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "progress_c"}},
          {"field": {"Name": "uploaded_at_c"}},
          {"field": {"Name": "url_c"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ]
      };
      
      const response = await apperClient.getRecordById('upload_c', parseInt(id), params);
      
      if (!response.success) {
        console.error("Failed to fetch upload:", response.message);
        throw new Error("Upload not found");
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching upload ${id}:`, error?.response?.data?.message || error);
      throw new Error("Upload not found");
    }
  },

  create: async (uploadData) => {
    try {
      const apperClient = getApperClient();
      const params = {
        records: [{
          Name: uploadData.name,
          size_c: uploadData.size,
          type_c: uploadData.type,
          status_c: "uploading",
          progress_c: 0,
          uploaded_at_c: new Date().toISOString(),
          url_c: ""
        }]
      };
      
      const response = await apperClient.createRecord('upload_c', params);
      
      if (!response.success) {
        console.error("Failed to create upload:", response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} uploads:`, failed);
        }
        
        if (successful.length > 0) {
          return successful[0].data;
        }
      }
      
      throw new Error("Failed to create upload");
    } catch (error) {
      console.error("Error creating upload:", error?.response?.data?.message || error);
      throw error;
    }
  },

  update: async (id, updateData) => {
    try {
      const apperClient = getApperClient();
      
      // Only include updateable fields
      const updateFields = {
        Id: parseInt(id)
      };
      
      if (updateData.name !== undefined) updateFields.Name = updateData.name;
      if (updateData.size !== undefined) updateFields.size_c = updateData.size;
      if (updateData.type !== undefined) updateFields.type_c = updateData.type;
      if (updateData.status !== undefined) updateFields.status_c = updateData.status;
      if (updateData.progress !== undefined) updateFields.progress_c = updateData.progress;
      if (updateData.uploadedAt !== undefined) updateFields.uploaded_at_c = updateData.uploadedAt;
      if (updateData.url !== undefined) updateFields.url_c = updateData.url;
      
      const params = {
        records: [updateFields]
      };
      
      const response = await apperClient.updateRecord('upload_c', params);
      
      if (!response.success) {
        console.error("Failed to update upload:", response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} uploads:`, failed);
        }
        
        if (successful.length > 0) {
          return successful[0].data;
        }
      }
      
      throw new Error("Failed to update upload");
    } catch (error) {
      console.error("Error updating upload:", error?.response?.data?.message || error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const apperClient = getApperClient();
      const params = { 
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord('upload_c', params);
      
      if (!response.success) {
        console.error("Failed to delete upload:", response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} uploads:`, failed);
          throw new Error("Failed to delete upload");
        }
        
        return successful.length > 0;
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting upload:", error?.response?.data?.message || error);
      throw error;
    }
  },

  // Simulate upload progress (keeping for UI functionality)
  simulateUpload: async (id, onProgress) => {
    try {
      const baseDelay = 50;
      
      for (let progress = 0; progress <= 100; progress += Math.random() * 5 + 1) {
        progress = Math.min(100, progress);
        
        const currentDelay = baseDelay * (1 + Math.random() * 0.5);
        await new Promise(resolve => setTimeout(resolve, currentDelay));
        
        // Update upload progress in database
        const updateData = {
          progress: Math.round(progress)
        };
        
        if (progress >= 100) {
          updateData.status = "completed";
          updateData.url = `https://example.com/uploads/upload-${id}`;
        }
        
        const updatedUpload = await uploadService.update(id, updateData);
        onProgress?.(updatedUpload);
      }

      return await uploadService.getById(id);
    } catch (error) {
      console.error("Error simulating upload:", error);
      throw error;
    }
  },

  cancel: async (id) => {
    try {
      const updatedUpload = await uploadService.update(id, {
        status: "cancelled",
        progress: 0
      });
      return updatedUpload;
    } catch (error) {
      console.error("Error cancelling upload:", error);
      throw new Error("Upload not found");
    }
  },

  pause: async (id) => {
    try {
      const updatedUpload = await uploadService.update(id, {
        status: "paused"
      });
      return updatedUpload;
    } catch (error) {
      console.error("Error pausing upload:", error);
      throw new Error("Upload not found");
    }
  },

  resume: async (id) => {
    try {
      const updatedUpload = await uploadService.update(id, {
        status: "uploading"
      });
      return updatedUpload;
    } catch (error) {
      console.error("Error resuming upload:", error);
      throw new Error("Upload not found");
    }
  },

  getRecentUploads: async (hours = 24) => {
    try {
      const apperClient = getApperClient();
      const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
      
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "size_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "progress_c"}},
          {"field": {"Name": "uploaded_at_c"}},
          {"field": {"Name": "url_c"}},
          {"field": {"Name": "Tags"}}
        ],
        where: [
          {"FieldName": "uploaded_at_c", "Operator": "GreaterThan", "Values": [cutoff]}
        ],
        orderBy: [{"fieldName": "uploaded_at_c", "sorttype": "DESC"}],
        pagingInfo: {"limit": 10, "offset": 0}
      };
      
      const response = await apperClient.fetchRecords('upload_c', params);
      
      if (!response.success) {
        console.error("Failed to fetch recent uploads:", response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching recent uploads:", error);
      return [];
    }
  },

  getUploadStats: async () => {
    try {
      const apperClient = getApperClient();
      
      // Get completed uploads
      const completedParams = {
        fields: [
          {"field": {"Name": "size_c"}},
          {"field": {"Name": "status_c"}}
        ],
        where: [
          {"FieldName": "status_c", "Operator": "EqualTo", "Values": ["completed"]}
        ],
        aggregators: [{
          "id": "TotalUploads",
          "fields": [{"field": {"Name": "Id"}, "Function": "Count"}]
        }],
        pagingInfo: {"limit": 1000, "offset": 0}
      };
      
      const completedResponse = await apperClient.fetchRecords('upload_c', completedParams);
      
      if (!completedResponse.success) {
        return {
          totalUploads: 0,
          totalSize: 0,
          averageSize: 0,
          recentUploads: 0,
          successRate: 100
        };
      }
      
      const completedUploads = completedResponse.data || [];
      const totalSize = completedUploads.reduce((sum, u) => sum + (u.size_c || 0), 0);
      
      // Get total uploads for success rate
      const totalParams = {
        aggregators: [{
          "id": "AllUploads",
          "fields": [{"field": {"Name": "Id"}, "Function": "Count"}]
        }]
      };
      
      const totalResponse = await apperClient.fetchRecords('upload_c', totalParams);
      const totalCount = totalResponse.success && totalResponse.aggregators?.[0]?.value || 0;
      
      return {
        totalUploads: completedUploads.length,
        totalSize,
        averageSize: completedUploads.length > 0 ? totalSize / completedUploads.length : 0,
        recentUploads: completedUploads.length,
        successRate: totalCount > 0 ? (completedUploads.length / totalCount) * 100 : 100
      };
    } catch (error) {
      console.error("Error fetching upload stats:", error);
      return {
        totalUploads: 0,
        totalSize: 0,
        averageSize: 0,
        recentUploads: 0,
        successRate: 100
      };
    }
  }
};