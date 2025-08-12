import supabase from '../config/database.js';

class Volunteer {
  static async create(volunteerData) {
    const { name, email, phone, interest, message } = volunteerData;
    
    try {
      const { data, error } = await supabase
        .from('volunteers')
        .insert([
          {
            name,
            email,
            phone,
            interest,
            message: message || null
          }
        ])
        .select()
        .single();

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          // Check which field caused the violation
          if (error.message.includes('volunteers_email_key')) {
            throw new Error('Email already exists');
          } else if (error.message.includes('volunteers_phone_unique') || error.message.includes('phone')) {
            throw new Error('Phone number already exists');
          } else {
            throw new Error('Email or phone number already exists');
          }
        }
        throw error;
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  static async findAll(limit = 50, offset = 0) {
    try {
      const { data, error } = await supabase
        .from('volunteers')
        .select('*')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    try {
      const { data, error } = await supabase
        .from('volunteers')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  }

  static async findByEmail(email) {
    try {
      const { data, error } = await supabase
        .from('volunteers')
        .select('*')
        .eq('email', email)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
      return data;
    } catch (error) {
      throw error;
    }
  }

  static async findByPhone(phone) {
    try {
      const { data, error } = await supabase
        .from('volunteers')
        .select('*')
        .eq('phone', phone)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
      return data;
    } catch (error) {
      throw error;
    }
  }

  static async updateStatus(id, status) {
    try {
      const { data, error } = await supabase
        .from('volunteers')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  }

  static async getCount() {
    try {
      const { count, error } = await supabase
        .from('volunteers')
        .select('*', { count: 'exact', head: true });

      if (error) throw error;
      return count;
    } catch (error) {
      throw error;
    }
  }
}

export default Volunteer;