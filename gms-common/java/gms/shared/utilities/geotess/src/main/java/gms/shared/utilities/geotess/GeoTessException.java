package gms.shared.utilities.geotess;

/**
 * <p>
 * Title:
 * </p>
 * 
 * <p>
 * Description:
 * </p>
 * 
 * <p>
 * Copyright: Copyright (c) 2007
 * </p>
 * 
 * @author Sandy Ballard
 * @version 2.0
 */
@SuppressWarnings("serial")
public class GeoTessException extends Exception
{
	/**
	 * 
	 */
	public GeoTessException()
	{
		super();
	}

	/**
	 * @param string
	 */
	public GeoTessException(String string)
	{
		super(string);
	}

	/**
	 * @param string
	 * @param throwable
	 */
	public GeoTessException(String string, Throwable throwable)
	{
		super(string, throwable);
	}

	/**
	 * @param throwable
	 */
	public GeoTessException(Throwable throwable)
	{
		super(throwable);
	}

	/**
	 * @param ex
	 * @return stack trace
	 */
	static public String getStackTraceAsString(Exception ex)
	{
		StringBuffer buf = new StringBuffer();
		// Recreate the stack trace into the error String.
		for (int i = 0; i < ex.getStackTrace().length; i++)
			buf.append(ex.getStackTrace()[i].toString()).append("\n");
		return buf.toString();
	}

}
